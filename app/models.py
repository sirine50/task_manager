from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class WorkSpaceCreate(BaseModel):
    name: str
    owner_id: int

class TaskCreate(BaseModel):
    content: str
    workspace_id: int