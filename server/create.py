from models.dict import create
from models.connect import connect

if __name__ == '__main__':
  engine = connect()
  create(engine)
