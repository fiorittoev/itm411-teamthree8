"""
routers/posts_items.py
──────────────────────
Routes for:
  POST   /posts           – create a post
  GET    /posts           – list posts (community or all)
  DELETE /posts/{id}      – delete own post

  POST   /items           – create a marketplace item
  GET    /items           – list items
  DELETE /items/{id}      – delete own item

Auth: Supabase JWT passed as  Authorization: Bearer <token>
      get_current_user() decodes it and returns the Supabase user dict.
      We look up (or lazy-create) a Profile row by email.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid
from app.db.session import get_db
from app.db.models import Post, PostType, Item, ItemCategory, Profile
from app.core.auth import get_current_user  # returns decoded Supabase JWT payload

router = APIRouter()


# ─── Helpers ──────────────────────────────────────────────────────────────────


def get_or_create_profile(user: dict, db: Session) -> Profile:
    """Resolve Supabase user → Profile row (lazy-create if first login)."""
    email = user.get("email") or user.get("user_metadata", {}).get("email")
    if not email:
        raise HTTPException(status_code=400, detail="No email in token")

    profile = db.query(Profile).filter(Profile.email == email).first()
    if not profile:
        username = email.split("@")[0]
        # ensure username uniqueness
        existing = db.query(Profile).filter(Profile.username == username).first()
        if existing:
            username = f"{username}_{str(uuid.uuid4())[:6]}"
        profile = Profile(email=email, username=username)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


# ─── Schemas ──────────────────────────────────────────────────────────────────


class PostCreate(BaseModel):
    title: str
    content: str
    post_type: Optional[str] = "general"  # "general" | "event" | "announcement"
    community_id: Optional[str] = None


class PostOut(BaseModel):
    id: str
    title: str
    content: str
    post_type: str
    created_at: str
    author_id: str
    author_username: str

    class Config:
        from_attributes = True


class ItemCreate(BaseModel):
    name: str
    price: str  # stored as string to match existing frontend
    description: Optional[str] = ""
    category: Optional[str] = "other"
    image: str  # base64 data-URI


class ItemOut(BaseModel):
    id: str
    name: str
    price: str
    description: Optional[str]
    category: str
    image: str
    owner_id: str
    owner_username: str
    created_at: str

    class Config:
        from_attributes = True


# ─── POST routes ──────────────────────────────────────────────────────────────


@router.post("/posts", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(
    body: PostCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)

    try:
        post_type_enum = PostType[body.post_type.upper()]
    except KeyError:
        post_type_enum = PostType.GENERAL

    community_id = None
    if body.community_id:
        community_id = uuid.UUID(body.community_id)

    post = Post(
        title=body.title,
        content=body.content,
        post_type=post_type_enum,
        author_id=profile.id,
        community_id=community_id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return _post_out(post, profile)


@router.get("/posts", response_model=list[PostOut])
def list_posts(
    community_id: Optional[str] = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    q = db.query(Post)
    if community_id:
        q = q.filter(Post.community_id == uuid.UUID(community_id))
    posts = q.order_by(Post.created_at.desc()).limit(100).all()

    results = []
    for post in posts:
        author = db.query(Profile).filter(Profile.id == post.author_id).first()
        results.append(_post_out(post, author))
    return results


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)
    post = db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != profile.id:
        raise HTTPException(status_code=403, detail="Not your post")

    db.delete(post)
    db.commit()


# ─── ITEM routes ──────────────────────────────────────────────────────────────


@router.post("/items", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(body, db, user):
    profile = get_or_create_profile(user, db)
    try:
        category_enum = ItemCategory[body.category.upper()]
    except KeyError:
        category_enum = ItemCategory.OTHER

    item = Item(
        owner_id=profile.id,
        name=body.name,
        price=body.price,
        description=body.description,
        image=body.image,
        category=category_enum,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _item_out(item, profile)


@router.get("/items", response_model=list[ItemOut])
def list_items(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    items = db.query(Item).order_by(Item.created_at.desc()).limit(200).all()
    results = []
    for item in items:
        owner = db.query(Profile).filter(Profile.id == item.owner_id).first()
        results.append(_item_out(item, owner))
    return results


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)
    item = db.query(Item).filter(Item.id == uuid.UUID(item_id)).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.owner_id != profile.id:
        raise HTTPException(status_code=403, detail="Not your item")

    db.delete(item)
    db.commit()


# ─── Serialisation helpers ────────────────────────────────────────────────────


def _post_out(post: Post, author: Optional[Profile]) -> dict:
    return {
        "id": str(post.id),
        "title": post.title,
        "content": post.content,
        "post_type": post.post_type.value if post.post_type else "general",
        "created_at": post.created_at.isoformat() if post.created_at else "",
        "author_id": str(post.author_id),
        "author_username": author.username if author else "unknown",
    }


def _item_out(item: Item, owner: Optional[Profile]) -> dict:
    return {
        "id": str(item.id),
        "name": item.name or "",
        "price": item.price or "",
        "description": item.description or "",
        "category": item.category.value if item.category else "other",
        "image": item.image or "",
        "owner_id": str(item.owner_id),
        "owner_username": owner.username if owner else "unknown",
        "created_at": item.created_at.isoformat() if item.created_at else "",
    }
