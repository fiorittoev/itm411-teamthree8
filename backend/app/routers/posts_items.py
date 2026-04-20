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
from app.db.models import Post, PostType, Item, ItemCategory, Profile, Community
from app.core.auth import get_current_user  # returns decoded Supabase JWT payload
from app.dependencies import get_or_create_profile  # centralized profile creation

router = APIRouter()


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
    author_is_business: bool = False
    author_business_name: Optional[str] = None
    author_profile_image_url: Optional[str] = None
    community_id: Optional[str] = None
    community_name: Optional[str] = None

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
    owner_is_business: bool = False
    owner_business_name: Optional[str] = None
    owner_profile_image_url: Optional[str] = None
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

    community = None
    if post.community_id:
        community = (
            db.query(Community).filter(Community.id == post.community_id).first()
        )
    return _post_out(post, profile, community)


@router.get("/posts", response_model=list[PostOut])
def list_posts(
    community_id: Optional[str] = None,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)
    q = db.query(Post)

    if user_id:
        try:
            q = q.filter(Post.author_id == uuid.UUID(user_id))
        except ValueError:
            return []
    elif community_id and community_id != "undefined":
        try:
            q = q.filter(Post.community_id == uuid.UUID(community_id))
        except ValueError:
            # If invalid UUID provided for a specific community filter, return no results
            return []
    else:
        # Global feed: show all posts from all communities by default
        pass

    posts = q.order_by(Post.created_at.desc()).limit(100).all()

    results = []
    for post in posts:
        author = db.query(Profile).filter(Profile.id == post.author_id).first()
        community = None
        if post.community_id:
            community = (
                db.query(Community).filter(Community.id == post.community_id).first()
            )
        results.append(_post_out(post, author, community))
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


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    community_id: Optional[str] = None
    profile_image_url: Optional[str] = None
    is_business: Optional[bool] = None
    business_name: Optional[str] = None


@router.patch("/profile/me")
def update_my_profile(
    body: ProfileUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)

    if body.username is not None:
        profile.username = body.username
    if body.bio is not None:
        profile.bio = body.bio
    if body.address is not None:
        profile.address = body.address
    if body.profile_image_url is not None:
        profile.profile_image_url = body.profile_image_url
    if body.is_business is not None:
        profile.is_business = body.is_business
    if body.business_name is not None:
        profile.business_name = body.business_name

    if body.community_id is not None:
        try:
            comm_uuid = uuid.UUID(body.community_id)
            community = db.query(Community).filter(Community.id == comm_uuid).first()
            if community:
                profile.communities = [community]
        except ValueError:
            pass

    db.commit()
    db.refresh(profile)
    return {"status": "success"}


@router.get("/profile/me")
def get_my_profile(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)

    # Get first community name and id from the relationship
    community = profile.communities[0].name if profile.communities else ""
    community_id = str(profile.communities[0].id) if profile.communities else None

    return {
        "id": str(profile.id),
        "username": profile.username,
        "email": profile.email,
        "bio": profile.bio or "",
        "address": profile.address or "",
        "community": community,
        "community_id": community_id,
        "profile_image_url": profile.profile_image_url or "",
        "is_business": profile.is_business or False,
        "business_name": profile.business_name or "",
    }


@router.get("/profile/{user_id}")
def get_user_profile(
    user_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Just to ensure the request is authenticated
    get_or_create_profile(user, db)

    try:
        target_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    target_profile = db.query(Profile).filter(Profile.id == target_uuid).first()
    if not target_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    community = target_profile.communities[0].name if target_profile.communities else ""
    community_id = (
        str(target_profile.communities[0].id) if target_profile.communities else None
    )

    return {
        "id": str(target_profile.id),
        "username": target_profile.username,
        "bio": target_profile.bio or "",
        "address": target_profile.address or "",
        "community": community,
        "community_id": community_id,
        "profile_image_url": target_profile.profile_image_url or "",
        "is_business": target_profile.is_business or False,
        "business_name": target_profile.business_name or "",
    }


# ─── ITEM routes ──────────────────────────────────────────────────────────────


@router.post("/items", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(
    body: ItemCreate,  # ← typed schema, not bare `body`
    db: Session = Depends(get_db),  # ← was missing Depends
    user=Depends(get_current_user),  # ← was missing Depends
):
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
    profile = get_or_create_profile(user, db)
    q = db.query(Item)

    # Global marketplace - no community restriction
    items = q.order_by(Item.created_at.desc()).limit(200).all()
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


def _post_out(
    post: Post, author: Optional[Profile], community: Optional[Community] = None
) -> dict:
    return {
        "id": str(post.id),
        "title": post.title,
        "content": post.content,
        "post_type": post.post_type.value if post.post_type else "general",
        "created_at": post.created_at.isoformat() if post.created_at else "",
        "author_id": str(post.author_id),
        "author_username": author.username if author else "unknown",
        "author_is_business": author.is_business if author else False,
        "author_business_name": author.business_name if author else None,
        "author_profile_image_url": author.profile_image_url if author else None,
        "community_id": str(post.community_id) if post.community_id else None,
        "community_name": community.name if community else None,
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
        "owner_is_business": owner.is_business if owner else False,
        "owner_business_name": owner.business_name if owner else None,
        "owner_profile_image_url": owner.profile_image_url if owner else None,
        "created_at": item.created_at.isoformat() if item.created_at else "",
    }


# Add this new endpoint to get community details
@router.get("/communities/{community_id}")
def get_community(
    community_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)
    try:
        comm = (
            db.query(Community).filter(Community.id == uuid.UUID(community_id)).first()
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid community_id")
    if not comm:
        raise HTTPException(status_code=404, detail="Community not found")
    # Ensure user is a member
    if profile.id not in [m.id for m in comm.members]:
        raise HTTPException(
            status_code=403, detail="You are not a member of this community"
        )
    return {
        "id": str(comm.id),
        "name": comm.name,
        "description": comm.description or "",
        "lake_name": comm.lake_name or "",
        "member_count": len(comm.members) if comm.members else 0,
    }
