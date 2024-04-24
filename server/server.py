from fastapi import FastAPI
from routers import dict, text, vocab

app = FastAPI()

app.include_router(dict.router)
app.include_router(text.router)
app.include_router(vocab.router)
