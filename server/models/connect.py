from sqlalchemy import create_engine
import os

def connect():
  user = os.environ.get('user')
  password = os.environ.get('password')
  database = 'LinguaPlayHub'
  return create_engine(f'mysql+pymysql://{user}:{password}@127.0.0.1/{database}', echo = True, max_overflow = 5)
