from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker
from models import connect, Dict, Text, TextTag
from typing import List
import re
import utils
from parse_sentence import parse

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

class ParseTextParams(BaseModel):
    text: str

@app.post("/api/text/parse")
def parse_sentence(item: ParseTextParams):
    sentences = re.split(r'\n+', item.text)
    return list(map(lambda s: parse(s), sentences))

class TextParams(BaseModel):
    id: int = None
    title: str
    tags: str = None
    desc: str = None
    content: str
    tokenization: str

@app.post("/api/text")
def save_text(item: TextParams, db=Depends(get_db)):
    if item.id:
        text = db.query(Text).filter_by(id=item.id).first()
        for key, value in item.dict().items():
            setattr(text, key, value) if value and key != 'id' else None
    else:
        text = Text(title=item.title, tags=item.tags, desc=item.desc, content=item.content, tokenization=item.tokenization)
        db.add(text)
    db.commit()
    db.refresh(text)
    return text

class TextDeleteParams(BaseModel):
    id: int

@app.post("/api/text/delete")
def delete_text(item: TextDeleteParams, db=Depends(get_db)):
    db.query(Text).filter_by(id=item.id).delete()
    db.commit()

@app.get("/api/text")
def get_text(id: str = None, db=Depends(get_db)):
    if id:
        return db.query(Text).filter_by(id=id).first()
    else:
        return db.query(Text).all()

class TextTagCreateParams(BaseModel):
    title: str

@app.post("/api/text/tag")
def create_tag(item: TextTagCreateParams, db=Depends(get_db)):
    db.add(TextTag(title=item.title))
    db.commit()

@app.get("/api/text/tag")
def get_tag(db=Depends(get_db)):
    return db.query(TextTag).all()
