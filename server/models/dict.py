from sqlalchemy import Column, String, Integer, Date
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Dict(Base):
    __tablename__ = "dict"
    id = Column(String(16), primary_key=True)
    title = Column(String(64))
    description = Column(String(256))
    create_date = Column(Date())
    entry = Column(Integer())
    filename = Column(String(32))

def create(engine):
    Base.metadata.create_all(engine)
