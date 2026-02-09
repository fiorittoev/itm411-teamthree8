from fastapi import FastAPI, Depends
from app.core.config import settings
from app.core.auth import get_current_user

app = FastAPI(title="MyMichiganLake API")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {"user": user}
