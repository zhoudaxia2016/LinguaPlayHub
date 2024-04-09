from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import utils

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/query/{word}", response_class=HTMLResponse)
def read_item(word: str, q: str = None):
    return utils.queryWord(word)
