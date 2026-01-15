from pydantic import BaseModel, constr

class UserCreate(BaseModel):
    email: str
    password: constr(min_length=6, max_length=72)

class UserLogin(BaseModel):
    email: str
    password: constr(min_length=6, max_length=72)

class TaskCreate(BaseModel):
    title: str

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        orm_mode = True

class PlanCreate(BaseModel):
    title: str
    description: str

class PlanResponse(BaseModel):
    id: int
    title: str
    description: str | None

    class Config:
        orm_mode = True


class AIQuestion(BaseModel):
    question: str
