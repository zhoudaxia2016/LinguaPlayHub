from fastapi import FastAPI
import utils

app = FastAPI()

@app.get("/api/query")
def read_item(word: str = None):
    content = {"html": utils.queryWord(word)}
    return content
