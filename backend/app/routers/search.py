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
            "created_at": self.created_at,
        }


class SearchUserResult:
    def __init__(self, profile):
        self.id = str(profile.id)
        self.username = profile.username
        self.bio = profile.bio or ""
        self.profile_image_url = profile.profile_image_url or ""
        self.address = profile.address or ""

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "bio": self.bio,
            "profile_image_url": self.profile_image_url,
            "address": self.address,
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


@router.get("/items")
def search_items(
    q: str = Query("", min_length=0),
    community_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Search marketplace items by name or description."""
    query = db.query(Item)

    # Filter by search query (name or description) if provided
    if q and q.strip():
        search_filter = or_(
            func.lower(Item.name).ilike(f"%{q.lower()}%"),
            func.lower(Item.description).ilike(f"%{q.lower()}%"),
        )
        query = query.filter(search_filter)

    # Optionally filter by community (through owner)
    if community_id and community_id != "undefined":
        try:
            comm_uuid = uuid.UUID(community_id)
            query = query.join(Profile).filter(
                Profile.communities.any(Community.id == comm_uuid)
            )
        except ValueError:
            pass

    results = query.order_by(Item.created_at.desc()).limit(limit).all()

    output = []
    for item in results:
        owner = db.query(Profile).filter(Profile.id == item.owner_id).first()
        result = SearchItemResult(item, owner)
        output.append(result.to_dict())

    return output


@router.get("/users")
def search_users(
    q: str = Query("", min_length=0),
    community_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Search user profiles by username or bio."""
    query = db.query(Profile)

    # Filter by search query (username or bio) if provided
    if q and q.strip():
        search_filter = or_(
            func.lower(Profile.username).ilike(f"%{q.lower()}%"),
            func.lower(Profile.bio).ilike(f"%{q.lower()}%"),
        )
        query = query.filter(search_filter)

    # Optionally filter by community
    if community_id and community_id != "undefined":
        try:
            comm_uuid = uuid.UUID(community_id)
            query = query.filter(Profile.communities.any(Community.id == comm_uuid))
        except ValueError:
            pass

    results = query.limit(limit).all()

    output = []
    for profile in results:
        result = SearchUserResult(profile)
        output.append(result.to_dict())

    return output


@router.get("/communities")
def search_communities(
    q: str = Query(..., min_length=1),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Search communities by name, description, or lake_name."""
    query = db.query(Community)

    # Filter by search query
    search_filter = or_(
        func.lower(Community.name).ilike(f"%{q.lower()}%"),
        func.lower(Community.description).ilike(f"%{q.lower()}%"),
        func.lower(Community.lake_name).ilike(f"%{q.lower()}%"),
    )
    query = query.filter(search_filter)

    results = query.limit(limit).all()

    output = []
    for community in results:
        result = SearchCommunityResult(community)
        output.append(result.to_dict())

    return output
