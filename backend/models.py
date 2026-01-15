from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import date


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    current_streak = Column(Integer, default=0)
    last_completed_date = Column(Date, nullable=True)

    # Relationships
    study_items = relationship("StudyItem", back_populates="owner")


class StudyItem(Base):
    __tablename__ = "study_items"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    type = Column(String)  # "task" or "plan"

    completed = Column(Boolean, default=False)
    completed_date = Column(Date, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="study_items")




