from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas
from dependencies import get_db
from auth import get_current_user

router = APIRouter(prefix="/plans", tags=["Plans"])


# -------------------- CREATE PLAN --------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_plan(
    plan: schemas.PlanCreate,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    new_plan = models.Plan(
        title=plan.title,
        description=plan.description,
        owner=user
    )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return {
        "message": "Study plan created",
        "plan_id": new_plan.id
    }


# -------------------- READ ALL PLANS --------------------
@router.get("/")
def get_plans(
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    plans = db.query(models.Plan).filter(
        models.Plan.owner_id == user.id
    ).all()

    return plans


# -------------------- READ SINGLE PLAN --------------------
@router.get("/{plan_id}")
def get_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    plan = db.query(models.Plan).filter(
        models.Plan.id == plan_id,
        models.Plan.owner_id == user.id
    ).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    return plan


# -------------------- UPDATE PLAN --------------------
@router.put("/{plan_id}")
def update_plan(
    plan_id: int,
    updated_plan: schemas.PlanCreate,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    plan = db.query(models.Plan).filter(
        models.Plan.id == plan_id,
        models.Plan.owner_id == user.id
    ).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    plan.title = updated_plan.title
    plan.description = updated_plan.description
    db.commit()

    return {"message": "Plan updated successfully"}


# -------------------- DELETE PLAN --------------------
@router.delete("/{plan_id}", status_code=status.HTTP_200_OK)
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    plan = db.query(models.Plan).filter(
        models.Plan.id == plan_id,
        models.Plan.owner_id == user.id
    ).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    db.delete(plan)
    db.commit()

    return {"message": "Plan deleted successfully"}
