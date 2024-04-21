from sqlalchemy import Column, String, JSON, DateTime, Integer
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class TextTag(Base):
    __tablename__ = "text_tag"
    title = Column(String(24), index=True, unique=True, primary_key=True)
    color = Column(String(7))

class Text(Base):
    __tablename__ = "text"
    id = Column(Integer, index=True, unique=True, autoincrement=True, primary_key=True)
    title = Column(String(50))
    tags = Column(JSON, nullable=True)
    desc = Column(String(100), nullable=True)
    create_time = Column(DateTime(timezone=True), server_default=func.now())
    content = Column(LONGTEXT)
    tokenization = Column(JSON)

def create(engine):
    Base.metadata.create_all(engine)
