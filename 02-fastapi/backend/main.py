from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
# Models
# ---------------------------------------------------------------------------


class Task(BaseModel):
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
# In-memory storage (replace with a real database for production use)
# ---------------------------------------------------------------------------

tasks: Dict[int, Task] = {}
_next_id: int = 1


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/")
def root() -> dict:
    return {"status": "ok", "service": "Task Management API"}


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(payload: TaskCreate) -> Task:
    global _next_id
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=422, detail="Title cannot be empty")

    task = Task(id=_next_id, title=title, done=payload.done)
    tasks[task.id] = task
    _next_id += 1
    return task


@app.get("/tasks", response_model=List[Task])
def get_tasks(done: Optional[bool] = Query(default=None)) -> List[Task]:
    result = list(tasks.values())
    if done is not None:
        result = [t for t in result if t.done == done]
    return result


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int) -> Task:
    task = tasks.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, payload: TaskUpdate) -> Task:
    task = tasks.get(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    updates = payload.model_dump(exclude_unset=True)
    if "title" in updates:
        new_title = (updates["title"] or "").strip()
        if not new_title:
            raise HTTPException(status_code=422, detail="Title cannot be empty")
        updates["title"] = new_title

    updated_task = task.model_copy(update=updates)
    tasks[task_id] = updated_task
    return updated_task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int) -> None:
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
