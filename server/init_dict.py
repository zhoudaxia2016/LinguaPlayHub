from sqlalchemy.orm import sessionmaker
from models import connect, Dict
from readmdict import MDX
import os
import hashlib

dict_dir = './dicts'
dict_files = os.listdir(dict_dir)
engine = connect()
DBSession = sessionmaker(engine)
session = DBSession()

for dict in dict_files:
    dict_path = os.path.join(dict_dir, dict)
    mdx = MDX(dict_path)
    header = mdx.header
    title = header[b'Title']
    description = header[b'Description']
    id = hashlib.sha1(title + description).hexdigest()[:16]
    create_date = header[b'CreationDate']
    entry = len([*mdx.items()])
    filename = dict
    session.add(Dict(id=id, title=title, description=description,
                     create_date=create_date, entry=entry, filename=filename, style=""))
    session.commit()
    session.close()
