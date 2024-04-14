from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker
from models import connect, Dict
from typing import List
import utils

app = FastAPI()

engine = connect()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class QueryParams(BaseModel):
    word: str
    dictList: List[str]

@app.post("/api/query")
def query(item: QueryParams, db=Depends(get_db)):
    word = item.word
    dictList = item.dictList
    allResult = []
    for dictId in dictList:
        dict = db.query(Dict).filter_by(id=dictId).first()
        title = dict.title
        if dict:
            result = utils.queryWord(word, dict)
            if isinstance(result, str):
                allResult.append({"html": result, 'title': title})
            else:
                result['title'] = title
                allResult.append(result)
    return allResult

@app.get("/api/dict/all")
def get_all_dicts(db=Depends(get_db)):
    dicts = db.query(Dict).all()
    return dicts
