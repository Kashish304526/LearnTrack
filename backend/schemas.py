from pydantic import BaseModel, constr, ConfigDict
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: constr(min_length=6, max_length=72)

class UserLogin(BaseModel):
    email: str
    password: constr(min_length=6, max_length=72)

class StudyItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str  # "task" or "plan"


class StudyItemUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    completed: Optional[bool]


class StudyItemResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    type: str
    completed: bool

    model_config = ConfigDict(from_attributes=True)


class AIQuestion(BaseModel):
    question: str
