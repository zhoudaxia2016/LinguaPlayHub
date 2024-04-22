from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models import Text, TextTag
import re
from routers.parse_sentence import parse
from routers.utils import get_db

router = APIRouter(prefix='/api/text')

class ParseTextParams(BaseModel):
    text: str

@router.post("/parse")
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

@router.post("/save")
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

@router.post("/delete")
def delete_text(item: TextDeleteParams, db=Depends(get_db)):
    db.query(Text).filter_by(id=item.id).delete()
    db.commit()

@router.get("/detail")
def get_text(id: str = None, db=Depends(get_db)):
    if id:
        return db.query(Text).filter_by(id=id).first()
    else:
        return db.query(Text).all()

class TextTagCreateParams(BaseModel):
    title: str

@router.post("/tag")
def create_tag(item: TextTagCreateParams, db=Depends(get_db)):
    db.add(TextTag(title=item.title))
    db.commit()

@router.get("/tag")
def get_tag(db=Depends(get_db)):
    return db.query(TextTag).all()
