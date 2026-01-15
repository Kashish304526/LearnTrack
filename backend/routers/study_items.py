from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

import models, schemas
from dependencies import get_db
from auth import get_current_user
from streaks import update_user_streak

router = APIRouter(prefix="/study-items", tags=["Study Items"])


# -----------------------------
# CREATE TASK / PLAN
# -----------------------------
@router.post("/", response_model=schemas.StudyItemResponse)
def create_study_item(
    item: schemas.StudyItemCreate,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    if item.type not in ["task", "plan"]:
        raise HTTPException(
            status_code=400,
            detail="type must be either 'task' or 'plan'"
        )

    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    new_item = models.StudyItem(
        title=item.title,
        description=item.description,
        type=item.type,
        owner=user
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# -----------------------------
# GET ALL TASKS / PLANS
# -----------------------------
@router.get("/", response_model=list[schemas.StudyItemResponse])
def get_study_items(
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    query = db.query(models.StudyItem).filter(
        models.StudyItem.owner_id == user.id
    )

    if type:
        if type not in ["task", "plan"]:
            raise HTTPException(
                status_code=400,
                detail="type must be either 'task' or 'plan'"
            )
        query = query.filter(models.StudyItem.type == type)

    return query.all()


# -----------------------------
# GET SINGLE TASK / PLAN
# -----------------------------
@router.get("/{item_id}", response_model=schemas.StudyItemResponse)
def get_study_item_by_id(
    item_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    item = db.query(models.StudyItem).filter(
        models.StudyItem.id == item_id,
        models.StudyItem.owner_id == user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    return item


# -----------------------------
# UPDATE TASK / PLAN
# -----------------------------
@router.put("/{item_id}", response_model=schemas.StudyItemResponse)
def update_study_item(
    item_id: int,
    updated_item: schemas.StudyItemUpdate,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    item = db.query(models.StudyItem).filter(
        models.StudyItem.id == item_id,
        models.StudyItem.owner_id == user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if updated_item.title is not None:
        item.title = updated_item.title

    if updated_item.description is not None:
        item.description = updated_item.description

    db.commit()
    db.refresh(item)

    return item


# -----------------------------
# COMPLETE TASK (STREAK LOGIC)
# -----------------------------
@router.patch("/{item_id}/complete")
def complete_study_item(
    item_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    item = db.query(models.StudyItem).filter(
        models.StudyItem.id == item_id,
        models.StudyItem.owner_id == user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.completed:
        return {"message": "Item already completed"}

    item.completed = True
    item.completed_date = date.today()

    # Update streak ONLY for tasks
    if item.type == "task":
        update_user_streak(user)

    db.commit()

    return {
        "message": "Item completed",
        "current_streak": user.current_streak
    }


# -----------------------------
# DELETE TASK / PLAN
# -----------------------------
@router.delete("/{item_id}")
def delete_study_item(
    item_id: int,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user)
):
    user = db.query(models.User).filter(
        models.User.email == user_email
    ).first()

    item = db.query(models.StudyItem).filter(
        models.StudyItem.id == item_id,
        models.StudyItem.owner_id == user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    return {"message": "Item deleted successfully"}
