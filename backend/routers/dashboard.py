from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models
from dependencies import get_db
from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard(
    user_email: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    # -------- TASK PROGRESS --------
    total_tasks = db.query(models.StudyItem).filter(
        models.StudyItem.owner_id == user.id,
        models.StudyItem.type == "task"
    ).count()

    completed_tasks = db.query(models.StudyItem).filter(
        models.StudyItem.owner_id == user.id,
        models.StudyItem.type == "task",
        models.StudyItem.completed == True
    ).count()

    pending_tasks = total_tasks - completed_tasks

    progress_percentage = (
        (completed_tasks / total_tasks) * 100
        if total_tasks > 0 else 0
    )

    # -------- PLANS COUNT (OPTIONAL) --------
    total_plans = db.query(models.StudyItem).filter(
        models.StudyItem.owner_id == user.id,
        models.StudyItem.type == "plan"
    ).count()

    return {
        "progress": {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "completion_percentage": round(progress_percentage, 2)
        },
        "streak": {
            "current_streak": user.current_streak,
            "last_completed_date": user.last_completed_date
        },
        "plans": {
            "total_plans": total_plans
        }
    }

