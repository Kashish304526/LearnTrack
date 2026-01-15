from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models
from dependencies import get_db
from auth import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/")
def get_leaderboard(
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    users = (
        db.query(models.User)
        .order_by(models.User.current_streak.desc())
        .limit(limit)
        .all()
    )

    leaderboard = []
    rank = 1

    for user in users:
        leaderboard.append({
            "rank": rank,
            "user": user.email,
            "streak": user.current_streak
        })
        rank += 1

    return leaderboard
