from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from pydantic import BaseModel
import uuid

from app.db.session import get_db
from app.db.models import Profile, Message
from app.core.auth import get_current_user
from app.routers.posts_items import get_or_create_profile

router = APIRouter(prefix="/messages", tags=["messages"])

class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    content: str
    created_at: str
    is_read: bool

    class Config:
        from_attributes = True

@router.post("/{receiver_id}", response_model=MessageOut)
def send_message(
    receiver_id: str,
    message: MessageCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    sender = get_or_create_profile(user, db)
    
    try:
        receiver_uuid = uuid.UUID(receiver_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid receiver_id")
        
    if receiver_uuid == sender.id:
        raise HTTPException(status_code=400, detail="Cannot message yourself")

    receiver = db.query(Profile).filter(Profile.id == receiver_uuid).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    new_msg = Message(
        sender_id=sender.id,
        receiver_id=receiver_uuid,
        content=message.content,
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    
    return {
        "id": str(new_msg.id),
        "sender_id": str(new_msg.sender_id),
        "receiver_id": str(new_msg.receiver_id),
        "content": new_msg.content,
        "created_at": new_msg.created_at.isoformat() if new_msg.created_at else "",
        "is_read": new_msg.is_read
    }

@router.get("/{other_user_id}", response_model=list[MessageOut])
def get_conversation(
    other_user_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    profile = get_or_create_profile(user, db)
    
    try:
        other_uuid = uuid.UUID(other_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid other_user_id")

    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == profile.id, Message.receiver_id == other_uuid),
            and_(Message.sender_id == other_uuid, Message.receiver_id == profile.id)
        )
    ).order_by(Message.created_at.asc()).limit(100).all()

    # Mark as read
    unread = [m for m in messages if m.receiver_id == profile.id and not m.is_read]
    if unread:
        for m in unread:
            m.is_read = True
        db.commit()

    results = []
    for m in messages:
        results.append({
            "id": str(m.id),
            "sender_id": str(m.sender_id),
            "receiver_id": str(m.receiver_id),
            "content": m.content,
            "created_at": m.created_at.isoformat() if m.created_at else "",
            "is_read": m.is_read
        })
    return results

@router.get("", response_model=list[dict])
def get_conversations(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    profile = get_or_create_profile(user, db)
    
    # We want a list of users we have conversations with, plus the latest message.
    messages = db.query(Message).filter(
        or_(Message.sender_id == profile.id, Message.receiver_id == profile.id)
    ).order_by(Message.created_at.desc()).all()
    
    convos = {}
    for m in messages:
        other_id = m.receiver_id if m.sender_id == profile.id else m.sender_id
        if other_id not in convos:
            other_user = db.query(Profile).filter(Profile.id == other_id).first()
            if not other_user:
                continue
            
            convos[other_id] = {
                "other_user_id": str(other_id),
                "other_username": other_user.username,
                "profile_image_url": other_user.profile_image_url or "",
                "latest_message": {
                    "id": str(m.id),
                    "sender_id": str(m.sender_id),
                    "content": m.content,
                    "created_at": m.created_at.isoformat() if m.created_at else "",
                    "is_read": m.is_read
                }
            }
            
    return list(convos.values())
