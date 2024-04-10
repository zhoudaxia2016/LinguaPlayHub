from fastapi import Request, FastAPI
import utils

activeDictIndex = 0

app = FastAPI()

utils.loadDictsMetaInfo()
utils.loadDict(activeDictIndex)

@app.get("/api/query")
def read_item(word: str = None):
    html = utils.queryWord(word, activeDictIndex)
    content = {"html": html, 'empty': html == ''}
    return content

@app.get("/api/dict/all")
def get_all_dicts():
    dicts = utils.getAllDictInfo()
    return dicts

@app.post("/api/dict/active")
async def set_active_dict(request: Request):
    json = await request.json()
    global activeDictIndex
    activeDictIndex = json['id']
    return

@app.get("/api/dict/active")
async def set_active_dict(request: Request):
    return activeDictIndex
