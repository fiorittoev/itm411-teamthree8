"""
routers/connections.py
──────────────────────
GET    /connections              – list accepted connections
GET    /connections/requests     – list incoming pending requests
POST   /connections/{user_id}    – send a connection request
PATCH  /connections/{user_id}    – accept or decline a request
DELETE /connections/{user_id}    – cancel sent request or remove connection
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional
import uuid

from app.db.session import get_db
from app.db.models import Profile, connections
from app.core.auth import get_current_user
from app.routers.posts_items import get_or_create_profile

router = APIRouter(prefix="/connections", tags=["connections"])


# ─── Helpers ──────────────────────────────────────────────────────────────────


def get_connection_row(db: Session, user_a_id, user_b_id):
    """Return the connection row between two users regardless of direction."""
    return db.execute(
        connections.select().where(
            or_(
                and_(
                    connections.c.requester_id == user_a_id,
                    connections.c.requestee_id == user_b_id,
                ),
                and_(
                    connections.c.requester_id == user_b_id,
                    connections.c.requestee_id == user_a_id,
                ),
            )
        )
    ).fetchone()


def profile_to_dict(p: Profile) -> dict:
    return {
        "id": str(p.id),
        "username": p.username,
        "bio": p.bio or "",
        "address": p.address or "",
        "profile_image_url": p.profile_image_url or "",
    }


# ─── Routes ───────────────────────────────────────────────────────────────────


@router.get("")
def list_connections(
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Return all accepted connections for the current user."""
    profile = get_or_create_profile(user, db)

    rows = db.execute(
        connections.select().where(
            and_(
                or_(
                    connections.c.requester_id == profile.id,
                    connections.c.requestee_id == profile.id,
                ),
                connections.c.status == "accepted",
            )
        )
    ).fetchall()

    result = []
    for row in rows:
        other_id = (
            row.requestee_id if row.requester_id == profile.id else row.requester_id
        )
        other = db.query(Profile).filter(Profile.id == other_id).first()
        if not other:
            continue
        if q and q.strip():
            ql = q.lower()
            if ql not in other.username.lower() and ql not in (other.bio or "").lower():
                continue
        result.append(profile_to_dict(other))

    return result


@router.get("/requests")
def list_requests(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Return all incoming pending requests."""
    profile = get_or_create_profile(user, db)

    rows = db.execute(
        connections.select().where(
            and_(
                connections.c.requestee_id == profile.id,
                connections.c.status == "pending",
            )
        )
    ).fetchall()

    result = []
    for row in rows:
        requester = db.query(Profile).filter(Profile.id == row.requester_id).first()
        if requester:
            result.append(profile_to_dict(requester))

    return result


@router.get("/status/{user_id}")
def get_connection_status(
    user_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Return connection status between current user and target.
    Response: { status: 'none' | 'pending_sent' | 'pending_received' | 'accepted' }
    """
    profile = get_or_create_profile(user, db)
    try:
        target_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    row = get_connection_row(db, profile.id, target_uuid)
    if not row:
        return {"status": "none"}

    if row.status == "accepted":
        return {"status": "accepted"}

    if row.status == "pending":
        if row.requester_id == profile.id:
            return {"status": "pending_sent"}
        return {"status": "pending_received"}

    return {"status": "none"}


@router.post("/{user_id}", status_code=status.HTTP_201_CREATED)
def send_request(
    user_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Send a connection request to another user."""
    profile = get_or_create_profile(user, db)
    try:
        target_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id")
    print(f"Current profile.id: {profile.id}")
    print(f"Target uuid:        {target_uuid}")
    print(f"Match: {target_uuid == profile.id}")
    if target_uuid == profile.id:
        raise HTTPException(status_code=400, detail="Cannot connect with yourself")

    target = db.query(Profile).filter(Profile.id == target_uuid).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = get_connection_row(db, profile.id, target_uuid)
    if existing:
        raise HTTPException(status_code=409, detail="Connection already exists")

    db.execute(
        connections.insert().values(
            requester_id=profile.id,
            requestee_id=target_uuid,
            status="pending",
        )
    )
    db.commit()
    return {"status": "pending_sent"}


@router.patch("/{user_id}")
def respond_to_request(
    user_id: str,
    action: str = Query(...),  # "accept" | "decline"
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Accept or decline an incoming request."""
    profile = get_or_create_profile(user, db)
    try:
        requester_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    row = db.execute(
        connections.select().where(
            and_(
                connections.c.requester_id == requester_uuid,
                connections.c.requestee_id == profile.id,
                connections.c.status == "pending",
            )
        )
    ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="No pending request found")

    if action == "accept":
        db.execute(
            connections.update()
            .where(
                and_(
                    connections.c.requester_id == requester_uuid,
                    connections.c.requestee_id == profile.id,
                )
            )
            .values(status="accepted")
        )
    else:
        db.execute(
            connections.delete().where(
                and_(
                    connections.c.requester_id == requester_uuid,
                    connections.c.requestee_id == profile.id,
                )
            )
        )

    db.commit()
    return {"status": "accepted" if action == "accept" else "declined"}


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_connection(
    user_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Cancel a sent request or remove an accepted connection."""
    profile = get_or_create_profile(user, db)
    try:
        target_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    row = get_connection_row(db, profile.id, target_uuid)
    if not row:
        raise HTTPException(status_code=404, detail="No connection found")

    db.execute(
        connections.delete().where(
            or_(
                and_(
                    connections.c.requester_id == profile.id,
                    connections.c.requestee_id == target_uuid,
                ),
                and_(
                    connections.c.requester_id == target_uuid,
                    connections.c.requestee_id == profile.id,
                ),
            )
        )
    )
    db.commit()
