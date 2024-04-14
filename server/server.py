from fastapi import Request, FastAPI, Depends
from sqlalchemy.orm import sessionmaker
from models import connect, Dict
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

@app.get("/api/query")
def read_item(word: str, dictId: str, db = Depends(get_db)):
    dict = db.query(Dict).filter_by(id=dictId).first()
    if dict:
        result = utils.queryWord(word, dict)
        if isinstance(result, str):
            return {"html": result}
        else:
            return result
    return {}

@app.get("/api/dict/all")
def get_all_dicts(db = Depends(get_db)):
    dicts = db.query(Dict).all()
    return dicts
