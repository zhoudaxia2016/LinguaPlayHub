from sqlalchemy import Column, String, Integer, TypeDecorator
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class WordType():
    noun = 1
    verb1 = 2
    verb2 = 3
    verb3 = 4
    pron = 5
    adj1 = 6
    adj2 = 7
    adv = 8
    wow = 9
    ques = 10
    conj = 11
    siam = 12

class IntEnum(TypeDecorator):
    impl = Integer

    def __init__(self, enumtype, *args, **kwargs):
        super(IntEnum, self).__init__(*args, **kwargs)
        self._enumtype = enumtype

    def process_bind_param(self, value, dialect):
        if isinstance(value, int):
            return value

        return value.value

    def process_result_value(self, value, dialect):
        return self._enumtype(value)

class TextbookWord(Base):
    __tablename__ = "textbook_dict"
    id = Column(Integer, index=True, unique=True, autoincrement=True, primary_key=True)
    entry = Column(String(32))
    hirakana = Column(String(32))
    lesson = Column(Integer())
    translation = Column(String(32))
    bookname = Column(String(16))
    wordtype = Column(Integer())
    level = Column(Integer())

def create(engine):
    Base.metadata.create_all(engine)
