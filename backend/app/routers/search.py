"""
routers/search.py
─────────────────
Search routes for items, users, and communities.

GET /search/items        – search marketplace items
GET /search/users        – search user profiles
GET /search/communities  – search communities

Query Parameters:
  q              – search query string
  community_id   – (optional) filter by community
  limit          – (optional) max results (default 50)
"""

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional
import uuid

from app.db.session import get_db
from app.db.models import Item, Profile, Community
from app.core.auth import get_current_user

router = APIRouter(prefix="/search", tags=["search"])


class SearchItemResult:
    def __init__(self, item, owner):
        self.id = str(item.id)
        self.name = item.name or ""
        self.price = item.price or ""
        self.description = item.description or ""
        self.category = item.category.value if item.category else "other"
        self.image = item.image or ""
        self.owner_id = str(item.owner_id)
        self.owner_username = owner.username if owner else "unknown"
        self.owner_is_business = owner.is_business if owner else False
        self.owner_business_name = owner.business_name if owner else None
        self.created_at = item.created_at.isoformat() if item.created_at else ""

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "category": self.category,
            "image": self.image,
            "owner_id": self.owner_id,
            "owner_username": self.owner_username,
            "owner_is_business": getattr(self, "owner_is_business", False),
            "owner_business_name": getattr(self, "owner_business_name", None),
            "created_at": self.created_at,
        }


class SearchUserResult:
    def __init__(self, profile):
        self.id = str(profile.id)
        self.username = profile.username
        self.bio = profile.bio or ""
        self.profile_image_url = profile.profile_image_url or ""
        self.address = profile.address or ""
        self.is_business = profile.is_business or False
        self.business_name = profile.business_name or ""

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "bio": self.bio,
            "profile_image_url": self.profile_image_url,
            "address": self.address,
            "is_business": self.is_business,
            "business_name": self.business_name,
        }


class SearchCommunityResult:
    def __init__(self, community):
        self.id = str(community.id)
        self.name = community.name
        self.description = community.description or ""
        self.lake_name = community.lake_name or ""
        self.member_count = len(community.members) if community.members else 0

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "lake_name": self.lake_name,
            "member_count": self.member_count,
        }


def get_user_community_ids(profile: Profile) -> list[uuid.UUID]:
    """Returns list of community UUIDs the user belongs to."""
    return [c.id for c in profile.communities] if profile.communities else []


def get_or_create_profile_by_email(user: dict, db: Session) -> Profile:
    email = user.get("email") or user.get("user_metadata", {}).get("email")
    if not email:
        raise HTTPException(status_code=400, detail="No email in token")
    profile = db.query(Profile).filter(Profile.email == email).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.get("/items")
def search_items(
    q: str = Query("", min_length=0),
    community_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile_by_email(user, db)
    query = db.query(Item)

    if q and q.strip():
        query = query.filter(
            or_(
                func.lower(Item.name).ilike(f"%{q.lower()}%"),
                func.lower(Item.description).ilike(f"%{q.lower()}%"),
            )
        )

    if community_id and community_id != "undefined":
        # ── Community screen: single community, verify membership ──
        try:
            comm_uuid = uuid.UUID(community_id)
            comm = db.query(Community).filter(Community.id == comm_uuid).first()
            if not comm or profile.id not in [m.id for m in comm.members]:
                raise HTTPException(
                    status_code=403, detail="Not a member of this community"
                )
            query = query.join(Profile, Profile.id == Item.owner_id).filter(
                Profile.communities.any(Community.id == comm_uuid)
            )
        except (ValueError, TypeError):
            return []
    # No restriction for global search (outside of specific community screen)

    results = query.order_by(Item.created_at.desc()).limit(limit).all()
    output = []
    for item in results:
        owner = db.query(Profile).filter(Profile.id == item.owner_id).first()
        output.append(SearchItemResult(item, owner).to_dict())
    return output


@router.get("/users")
def search_users(
    q: str = Query("", min_length=0),
    community_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile_by_email(user, db)
    query = db.query(Profile)

    # Only filter out self if NOT searching within a specific community members list
    if not community_id:
        query = query.filter(Profile.id != profile.id)

    if q and q.strip():
        query = query.filter(
            or_(
                func.lower(Profile.username).ilike(f"%{q.lower()}%"),
                func.lower(Profile.bio).ilike(f"%{q.lower()}%"),
            )
        )

    if community_id and community_id != "undefined":
        # ── Community screen: single community, verify membership ──
        try:
            comm_uuid = uuid.UUID(community_id)
            comm = db.query(Community).filter(Community.id == comm_uuid).first()
            if not comm or profile not in comm.members:
                raise HTTPException(
                    status_code=403, detail="Not a member of this community"
                )
            query = query.filter(Profile.communities.any(Community.id == comm_uuid))
        except (ValueError, TypeError):
            return []
    # No restriction for global search

    results = query.limit(limit).all()
    return [SearchUserResult(p).to_dict() for p in results]


@router.get("/communities")
def search_communities(
    q: str = Query("", min_length=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile_by_email(user, db)
    community_ids = get_user_community_ids(profile)

    query = db.query(Community)

    # Show all communities matching search or all if no search string
    # (Optional: keep restriction if we only want users to find communities they can join?)
    # The user wants "anything outside of community" to show up.

    if q and q.strip():
        query = query.filter(
            or_(
                func.lower(Community.name).ilike(f"%{q.lower()}%"),
                func.lower(Community.lake_name).ilike(f"%{q.lower()}%"),
                func.lower(Community.description).ilike(f"%{q.lower()}%"),
            )
        )

    results = query.limit(limit).all()
    return [SearchCommunityResult(c).to_dict() for c in results]
