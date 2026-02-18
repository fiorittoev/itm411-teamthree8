from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from app.core.config import settings
from app.core.auth import get_current_user
from app.db.models import Profile
from app.db.base import Base
from app.db.session import engine
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Interest

app = FastAPI(title="MyMichiganLake API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {"user": user}


@app.post("/interests/populate")
def populate_interests(interests: list[str], db: Session = Depends(get_db)):
    if not interests:
        raise HTTPException(status_code=400, detail="No interests provided")

    added_interests = []
    for interest_name in interests:
        clean_name = interest_name.strip().title()
        existing = db.query(Interest).filter(Interest.name == clean_name).first()
        if not existing:
            new_interest = Interest(name=clean_name)
            db.add(new_interest)
            added_interests.append(clean_name)

    db.commit()
    return {"added": added_interests, "total": len(added_interests)}


# --- Maps Routes ---


@app.get("/maps/autocomplete")
async def autocomplete(input: str = Query(...)):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://maps.googleapis.com/maps/api/place/autocomplete/json",
            params={
                "input": input,
                "types": "address",
                "components": "country:us",
                "key": settings.GOOGLE_MAPS_API_KEY,
            },
        )
    return res.json()


@app.get("/maps/place-details")
async def place_details(place_id: str = Query(...)):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            params={
                "place_id": place_id,
                "fields": "address_components,geometry",
                "key": settings.GOOGLE_MAPS_API_KEY,
            },
        )
    return res.json()


@app.get("/maps/nearby-lakes")
async def nearby_lakes(lat: float = Query(...), lng: float = Query(...)):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            params={
                "location": f"{lat},{lng}",
                "radius": 80000,
                "type": "natural_feature",
                "keyword": "lake",
                "key": settings.GOOGLE_MAPS_API_KEY,
            },
        )
    data = res.json()
    # Return results as-is so frontend can access .name on each object
    return {"results": (data.get("results") or [])[:5]}
