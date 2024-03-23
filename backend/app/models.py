from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

# class Item(Base):
#     __tablename__ = 'items'

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column (String(50), index=True)  # Adjust the length as needed
#     description = Column (String(255), index=True)  # Adjust the length as needed

# class User(Base):
#     __tablename__ = 'users'

#     id = Column (Integer, primary_key=True, index=True)
#     username = Column (String (50), unique=True)

# Define SQLAlchemy models
Base = declarative_base()

##models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)
    password = Column(String(50))
    is_active = Column(Boolean, default=True)

    tasks = relationship("Task", back_populates="owner")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(String(255), index=True)
    completed = Column(Boolean)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="tasks")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "owner_id": self.owner_id
        }
