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
from app.routers.posts_items import router as posts_items_router
from app.routers.posts_items import PostType, ItemCategory
from pydantic import BaseModel
from starlette.middleware.trustedhost import TrustedHostMiddleware


app = FastAPI(title="MyMichiganLake API")
from starlette.middleware import Middleware

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

app.include_router(posts_items_router)


# ─── Core routes ──────────────────────────────────────────────────────────────


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


# ─── Maps routes ──────────────────────────────────────────────────────────────


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
    return {"results": (data.get("results") or [])[:5]}


@app.get("/profile/me")
def get_my_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == user["sub"]).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@app.patch("/profile/me")
def update_my_profile(
    updates: dict, user=Depends(get_current_user), db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.id == user["sub"]).first()
    for key, value in updates.items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile


class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str
    address: str | None = None
    community: str | None = None
    bio: str | None = None
    items: list[dict] | None = None


@app.post("/register")
async def register(body: RegisterRequest, db: Session = Depends(get_db)):
    # Create auth user via Supabase Admin REST API
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{settings.SUPABASE_URL}/auth/v1/admin/users",
            headers={
                "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "email": body.email,
                "password": body.password,
                "email_confirm": True,
            },
        )
        if res.status_code != 200:
            raise HTTPException(
                status_code=400, detail=res.json().get("msg", "Failed to create user")
            )

        user_id = res.json()["id"]

    # Create profile
    profile = Profile(
        id=user_id,
        email=body.email,
        username=body.username,
        address=body.address,
        community=body.community,
        bio=body.bio,
    )
    db.add(profile)
    db.commit()

    # Create items
    if body.items:
        for item in body.items:
            try:
                category_enum = ItemCategory[item.get("category", "other").upper()]
            except KeyError:
                category_enum = ItemCategory.OTHER
            db.add(
                Item(
                    owner_id=profile.id,
                    name=item.get("name", ""),
                    description=item.get("description") or None,
                    category=category_enum,
                )
            )
        db.commit()

    return {"user_id": user_id}


@app.get("/check-email")
async def check_email(email: str = Query(...)):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{settings.SUPABASE_URL}/auth/v1/admin/users",
            headers={
                "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
            },
            params={"filter": f"email.eq.{email}"},
        )
    users = res.json().get("users", [])
    return {"taken": len(users) > 0}
