from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from db import Base, TaskDB, engine, get_db

# Create the tables if they don't exist yet (fine for learning; use Alembic later).
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API")

# Allow the frontend (e.g. a Next.js dev server on another origin) to call this
# API directly from the browser. Tighten allow_origins to your frontend's exact
# origin(s) before deploying to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas (API layer, Pydantic)
# ---------------------------------------------------------------------------


class Task(BaseModel):
    # Lets Pydantic read attributes from a TaskDB object (not just from dicts).
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    done: bool = False


class TaskCreate(BaseModel):
    title: str
    done: bool = False


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    done: Optional[bool] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/")
def root() -> dict:
    return {"status": "ok", "service": "Task Management API"}


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> TaskDB:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=422, detail="Title cannot be empty")

    task = TaskDB(title=title, done=payload.done)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.get("/tasks", response_model=List[Task])
def get_tasks(
    done: Optional[bool] = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(TaskDB).order_by(TaskDB.id)
    if done is not None:
        stmt = stmt.where(TaskDB.done == done)
    return db.scalars(stmt).all()


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int, db: Session = Depends(get_db)) -> TaskDB:
    task = db.get(TaskDB, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(
    task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)
) -> TaskDB:
    task = db.get(TaskDB, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    updates = payload.model_dump(exclude_unset=True)
    if "title" in updates:
        new_title = (updates["title"] or "").strip()
        if not new_title:
            raise HTTPException(status_code=422, detail="Title cannot be empty")
        updates["title"] = new_title

    for field, value in updates.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)) -> None:
    task = db.get(TaskDB, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
