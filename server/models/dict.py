from sqlalchemy import Column, String, Integer, Date
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.mysql import LONGTEXT

Base = declarative_base()

class Dict(Base):
    __tablename__ = "dict"
    id = Column(Integer, autoincrement=True, primary_key=True)
    title = Column(String(130))
    description = Column(LONGTEXT)
    create_date = Column(Date())
    entry = Column(Integer())
    filename = Column(String(130))
    style = Column(LONGTEXT, nullable=True)

def create(engine):
    Base.metadata.create_all(engine)
