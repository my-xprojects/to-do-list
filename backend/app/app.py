import os
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import models
from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker

from typing import List


# Get the database URL from environment variable
database_url = os.getenv("SQLALCHEMY_DATABASE_URL")

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_default_user():
    db = SessionLocal()
    userCreated = False
    default_user = db.query(models.User).filter(models.User.username == "admin").first()
    if default_user is None:
        default_user_data = {
            "username": "admin",
            "email": "default@example.com",
            "password": "admin",
            "is_active": True
        }
        default_user = UserCreate(**default_user_data)
        db_user = models.User(**default_user.dict())
        db.add(db_user)
        db.commit()
        print("user is created successfully")
        return True
    return False


# Pydantic models
class TaskBase(BaseModel):
    title: str
    description: str
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class UserBase(BaseModel):
    username: str
    email: str
    password: str
    is_active: bool

class UserCreate(UserBase):
    pass

class Task(TaskBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class User(UserBase):
    id: int
    tasks: List[Task] = []

    class Config:
        orm_mode = True

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

# Allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

create_default_user()

def get_user(username: str):
    db = SessionLocal()
    db_post = db.query(models.User).filter(models.User.username == username).first()
    if db_post:
        return db_post
    else:
        raise HTTPException(status_code=500, detail=f"Failed to get the user")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = get_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not form_data.password == user.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}

@app.get("/items/")
async def read_items(token: str = Depends(oauth2_scheme)):
    return {"token": token}

@app.get("/users/me")
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    db = SessionLocal()
    db_check_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_check_user:
        raise HTTPException (status_code=404, detail='User is already exist')
    db_user = models.User(**user.dict())
    if db_user:
        db.add(db_user)
        db.commit()
        return db_user
    else:
        raise HTTPException(status_code=500, detail=f"Failed to create user")

@app.get("/tasks/")
async def read_tasks(skip: int = 0, limit: int = 10, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).offset(skip).limit(limit).all()
    return tasks

@app.post("/tasks/", status_code=status.HTTP_201_CREATED)
async def create_task(task_create: TaskCreate, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    db_task = models.Task(**task_create.dict(), owner_id=current_user.id)
    if db_task:
        db.add(db_task)
        db.commit()
    else:
        raise HTTPException(status_code=500, detail=f"Failed to create item")
    return models.Task(**task_create.dict(), owner_id=current_user.id)

@app.put("/tasks/{task_id}")
async def update_task(task_id: int, task_update: TaskCreate, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if db_task:
        for field, value in task_update.dict(exclude_unset=True).items():
            setattr(db_task, field, value)
        db.commit()
        db.refresh(db_task)
        db.close()
        return db_task.to_dict()
    else:
        raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        db.close()
        return {"message": "Task deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

