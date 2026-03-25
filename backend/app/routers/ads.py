"""
routers/ads.py
──────────────
Endpoints for business ad requests and approval flow.

  POST   /ads                    – Business submits an ad (→ email to admin)
  GET    /ads                    – Returns all APPROVED ads (for feed injection)
  GET    /ads/mine               – Returns current business user's ads
  POST   /ads/{id}/approve       – Admin approves ad (secured by ADMIN_SECRET)
  POST   /ads/{id}/reject        – Admin rejects ad (secured by ADMIN_SECRET)
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone

from app.db.session import get_db
from app.db.models import Ad, AdStatus, AdType, Profile
from app.core.auth import get_current_user
from app.core.config import settings

router = APIRouter()


# ─── Helpers ──────────────────────────────────────────────────────────────────


def get_profile(user: dict, db: Session) -> Profile:
    email = user.get("email") or user.get("user_metadata", {}).get("email")
    if not email:
        raise HTTPException(status_code=400, detail="No email in token")
    profile = db.query(Profile).filter(Profile.email == email).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


def send_approval_email(ad: Ad, owner: Profile):
    """Send an approval-request email to the admin with approve/reject links."""
    if not settings.GMAIL_USER or not settings.GMAIL_APP_PASSWORD:
        # If email is not configured, skip silently but log
        print(f"[ads] Email not configured – ad {ad.id} pending manual approval")
        return

    admin_email = "fiorittoev@gmail.com"
    base = settings.API_BASE_URL
    secret = settings.ADMIN_SECRET

    approve_url = f"{base}/ads/{ad.id}/approve?secret={secret}"
    reject_url = f"{base}/ads/{ad.id}/reject?secret={secret}"

    html = f"""
    <h2>New Ad Request – MyMichiganLake</h2>
    <p><strong>Business:</strong> {owner.business_name or owner.username}</p>
    <p><strong>Type:</strong> {ad.ad_type.value.upper()}</p>
    <p><strong>Title:</strong> {ad.title}</p>
    <p><strong>Body:</strong><br>{ad.body}</p>
    {"<p><strong>Link:</strong> " + (ad.link_url or "") + "</p>" if ad.link_url else ""}
    <br>
    <a href="{approve_url}" style="background:#2e7d32;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
      ✅ Approve Ad
    </a>
    &nbsp;&nbsp;
    <a href="{reject_url}" style="background:#c62828;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
      ❌ Reject Ad
    </a>
    <br><br>
    <small>Ad ID: {ad.id}</small>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Ad Request] [{ad.ad_type.value.upper()}] {ad.title}"
    msg["From"] = settings.GMAIL_USER
    msg["To"] = admin_email
    msg.attach(MIMEText(html, "html"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(settings.GMAIL_USER, settings.GMAIL_APP_PASSWORD)
            server.sendmail(settings.GMAIL_USER, admin_email, msg.as_string())
        print(f"[ads] Approval email sent for ad {ad.id}")
    except Exception as e:
        print(f"[ads] Failed to send email: {e}")
        # Don't raise — ad is still submitted even if email fails


# ─── Schemas ──────────────────────────────────────────────────────────────────


class AdCreate(BaseModel):
    title: str
    body: str
    ad_type: Optional[str] = "post"      # "post" | "marketplace"
    image: Optional[str] = None
    link_url: Optional[str] = None


class AdOut(BaseModel):
    id: str
    title: str
    body: str
    ad_type: str
    image: Optional[str]
    link_url: Optional[str]
    status: str
    owner_username: str
    business_name: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


# ─── Routes ───────────────────────────────────────────────────────────────────


@router.post("/ads", response_model=AdOut, status_code=status.HTTP_201_CREATED)
def submit_ad(
    body: AdCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    owner = get_profile(user, db)
    if not owner.is_business:
        raise HTTPException(
            status_code=403,
            detail="Only business accounts can submit ads",
        )

    # Convert ad_type string to enum
    try:
        atype = AdType(body.ad_type) if body.ad_type else AdType.POST
    except ValueError:
        atype = AdType.POST

    ad = Ad(
        owner_id=owner.id,
        title=body.title,
        body=body.body,
        ad_type=atype,
        image=body.image,
        link_url=body.link_url,
        status=AdStatus.PENDING,
    )
    db.add(ad)
    db.commit()
    db.refresh(ad)

    # Fire off the approval email (non-blocking; errors are logged not raised)
    send_approval_email(ad, owner)

    return _ad_out(ad, owner)


@router.get("/ads", response_model=list[AdOut])
def list_approved_ads(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Returns all approved ads — used by the frontend to inject into feeds."""
    ads = (
        db.query(Ad)
        .filter(Ad.status == AdStatus.APPROVED)
        .order_by(Ad.approved_at.desc())
        .all()
    )
    results = []
    for ad in ads:
        owner = db.query(Profile).filter(Profile.id == ad.owner_id).first()
        results.append(_ad_out(ad, owner))
    return results


@router.get("/ads/mine", response_model=list[AdOut])
def list_my_ads(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Business user can check the status of their own ads."""
    owner = get_profile(user, db)
    ads = (
        db.query(Ad)
        .filter(Ad.owner_id == owner.id)
        .order_by(Ad.created_at.desc())
        .all()
    )
    return [_ad_out(ad, owner) for ad in ads]


@router.post("/ads/{ad_id}/approve", status_code=status.HTTP_200_OK)
def approve_ad(
    ad_id: str,
    secret: str = Query(...),
    db: Session = Depends(get_db),
):
    """Admin-only endpoint. Secured by ADMIN_SECRET query param."""
    if secret != settings.ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")

    try:
        ad = db.query(Ad).filter(Ad.id == uuid.UUID(ad_id)).first()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ad_id")

    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    ad.status = AdStatus.APPROVED
    ad.approved_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Ad approved", "ad_id": ad_id}


@router.post("/ads/{ad_id}/reject", status_code=status.HTTP_200_OK)
def reject_ad(
    ad_id: str,
    secret: str = Query(...),
    db: Session = Depends(get_db),
):
    """Admin-only endpoint. Secured by ADMIN_SECRET query param."""
    if secret != settings.ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid secret")

    try:
        ad = db.query(Ad).filter(Ad.id == uuid.UUID(ad_id)).first()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ad_id")

    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    ad.status = AdStatus.REJECTED
    db.commit()
    return {"message": "Ad rejected", "ad_id": ad_id}


# ─── Serialisation ────────────────────────────────────────────────────────────


def _ad_out(ad: Ad, owner: Optional[Profile]) -> dict:
    return {
        "id": str(ad.id),
        "title": ad.title,
        "body": ad.body,
        "image": ad.image,
        "link_url": ad.link_url,
        "status": ad.status.value if ad.status else "pending",
        "owner_username": owner.username if owner else "unknown",
        "business_name": owner.business_name if owner else None,
        "created_at": ad.created_at.isoformat() if ad.created_at else "",
    }
