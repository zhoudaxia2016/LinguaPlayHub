from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models import Vocab
from routers.utils import get_db
import datetime

router = APIRouter(prefix='/api/vocab')

class AddParams(BaseModel):
    name: str
    kana: str = None

@router.post("/add")
def add(item: AddParams, db=Depends(get_db)):
    word = db.query(Vocab).filter_by(name=item.name).first()
    if word:
        return {}
    word = Vocab(name=item.name, kana=item.kana, status=10)
    db.add(word)
    db.commit()
    db.refresh(word)
    return word

class UpdateParams(BaseModel):
    id: int
    status: int

@router.post("/update")
def update(item: UpdateParams, db=Depends(get_db)):
    status = item.status
    word = db.query(Vocab).filter_by(id=item.id).first()
    if status > 100:
        status = 100
    if status == 100:
        word.finish_date = datetime.datetime.today()
    word.status = status
    db.commit()

class DeleteParams(BaseModel):
    id: int

@router.post("/delete")
def delete(item: DeleteParams, db=Depends(get_db)):
    word = db.query(Vocab).filter_by(id=item.id).first()
    db.delete(word)
    db.commit()

class SearchParams(BaseModel):
    name: str

@router.get("/search")
def search(name: str, iskana: bool = False, db=Depends(get_db)):
    print(name, iskana)
    if iskana:
        word = db.query(Vocab).filter_by(kana=name).first()
    else:
        word = db.query(Vocab).filter_by(name=name).first()
    return word

@router.get("/all")
def all(db=Depends(get_db)):
    words = db.query(Vocab).all()
    return words
