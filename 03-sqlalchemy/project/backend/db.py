import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

# Connection URL format: dialect+driver://user:password@host:port/database
# Override it with the DATABASE_URL environment variable; never commit real credentials.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/tasks_db",
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


class TaskDB(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    done: Mapped[bool] = mapped_column(default=False)


def get_db():
    """One session per request: opened here, always closed afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
