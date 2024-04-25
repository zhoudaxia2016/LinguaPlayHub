from fastapi import FastAPI
from routers import dict, text, vocab
import uvicorn

app = FastAPI()

app.include_router(dict.router)
app.include_router(text.router)
app.include_router(vocab.router)

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, log_level="debug", reload=True)
