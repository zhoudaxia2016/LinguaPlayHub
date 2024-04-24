from sqlalchemy import Column, String, Integer, Date
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Vocab(Base):
    __tablename__ = "vocab"
    id = Column(Integer, index=True, unique=True, autoincrement=True, primary_key=True)
    name = Column(String(64), index=True, unique=True)
    create_date = Column(Date(), default=func.current_date())
    finish_date = Column(Date())
    status = Column(Integer())

def create(engine):
    Base.metadata.create_all(engine)
