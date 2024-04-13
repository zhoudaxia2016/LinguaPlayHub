from sqlalchemy import Column, String, Integer, Date
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import connect
from readmdict import MDX

Base = declarative_base()

class Dict(Base):
  __tablename__ = "dict"
  title = Column(String(64), primary_key = True)
  description = Column(String(256))
  create_date = Column(Date())
  entry = Column(Integer())
  filename = Column(String(32))

def create(engine):
  Base.metadata.create_all(engine)

if __name__ == '__main__':
  dict_dir = '../dicts'
  dict_files = os.listdir(dict_dir)
  engine = connect.connect()
  DBSession = sessionmaker(engine)
  session = DBSession()
  for dict in dict_files:
    dict_path = os.path.join(dict_dir, dict)
    mdx = MDX(dict_path)
    header = mdx.header
    title = header[b'Title']
    description = header[b'Description']
    create_date = header[b'CreationDate']
    entry = len([*mdx.items()])
    filename = dict
    session.add(Dict(title=title, description=description, create_date = create_date, entry = entry, filename = filename))
  session.commit()
  session.close()
