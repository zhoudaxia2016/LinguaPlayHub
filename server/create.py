from models.dict import create as dict_create
from models.textbook_dict import create as textbook_dict_create
from models.connect import connect

if __name__ == '__main__':
    engine = connect()
    dict_create(engine)
    textbook_dict_create(engine)
