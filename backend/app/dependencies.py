"""
dependencies.py
───────────────
Centralized FastAPI dependencies and database utilities.

Functions:
  - get_or_create_profile(user, db): Get or create user profile from JWT claims
  - requires_admin(user): Dependency ensuring user has admin role in JWT
"""

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from app.db.session import get_db
from app.db.models import Profile
from app.core.auth import get_current_user


def get_or_create_profile(user: dict, db: Session) -> Profile:
    """
    Extract email from JWT and get/create corresponding Profile row.
    Used across all routers to ensure user has a profile before creating content.
    """
    email = user.get("email") or user.get("user_metadata", {}).get("email")
    if not email:
        raise HTTPException(status_code=400, detail="No email in token")

    profile = db.query(Profile).filter(Profile.email == email).first()
    if not profile:
        # Auto-create profile with username from email prefix
        username = email.split("@")[0]
        existing = db.query(Profile).filter(Profile.username == username).first()
        if existing:
            username = f"{username}_{str(uuid.uuid4())[:6]}"
        profile = Profile(email=email, username=username)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def requires_admin(user: dict = Depends(get_current_user)) -> dict:
    """
    Dependency that enforces admin role in JWT.
    Use in protected endpoints: def approve_ad(..., _=Depends(requires_admin))
    """
    is_admin = user.get("is_admin", False)
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required"
        )
    return user
