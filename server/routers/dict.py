from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models import Dict
from typing import List
from routers.utils import get_db
from routers.query_dict import queryWord

router = APIRouter(prefix='/api/dict')

class QueryParams(BaseModel):
    word: str
    dictList: List[int]

@router.post("/query")
def query(item: QueryParams, db=Depends(get_db)):
    word = item.word
    dictList = item.dictList
    allResult = []
    for dictId in dictList:
        dict = db.query(Dict).filter_by(id=dictId).first()
        title = dict.title
        if dict:
            result = queryWord(word, dict)
            if isinstance(result, str):
                allResult.append({"html": result, 'title': title, 'id': dictId})
            else:
                result['title'] = title
                result['id'] = dictId
                allResult.append(result)
    return allResult

@router.get("/all")
def get_all_dicts(db=Depends(get_db)):
    dicts = db.query(Dict).all()
    return dicts

class UpdateStyleParams(BaseModel):
    id: str
    style: str

@router.post('/style/update')
def update_style(item: UpdateStyleParams, db=Depends(get_db)):
    dict = db.query(Dict).filter_by(id=item.id).first()
    dict.style = item.style
    db.commit()
