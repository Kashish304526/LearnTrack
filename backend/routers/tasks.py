from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas
from datetime import date
from dependencies import get_db
from auth import get_current_user
from streaks import update_user_streak

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# -------------------- CREATE TASK --------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    new_task = models.Task(
        title=task.title,
        owner=user
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {"message": "Task created", "task_id": new_task.id}


# -------------------- READ ALL TASKS --------------------
@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    tasks = db.query(models.Task).filter(
        models.Task.owner_id == user.id
    ).all()

    return tasks


# -------------------- READ SINGLE TASK --------------------
@router.get("/{task_id}")
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


# -------------------- UPDATE TASK --------------------
@router.put("/{task_id}")
def update_task(
    task_id: int,
    updated_task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.title = updated_task.title
    db.commit()

    return {"message": "Task updated"}


# -------------------- COMPLETE TASK --------------------
@router.patch("/{task_id}/complete")
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.completed:
        return {"message": "Task already completed"}

    # Mark task completed
    task.completed = True
    task.completed_date = date.today()

    # Update streak
    update_user_streak(user)

    db.commit()

    return {
        "message": "Task completed",
        "current_streak": user.current_streak
    }

# -------------------- DELETE TASK --------------------
@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}

# -------------------- GET USER STREAK --------------------
@router.get("/me/streak")
def get_streak(
    user_email: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    return {
        "current_streak": user.current_streak,
        "last_completed_date": user.last_completed_date
    }
