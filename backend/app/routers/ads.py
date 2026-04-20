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
from datetime import datetime, timezone

from app.db.session import get_db
from app.db.models import Ad, AdStatus, AdType, Profile
from app.core.auth import get_current_user
from app.core.config import settings
from app.dependencies import get_or_create_profile, requires_admin

router = APIRouter()


# ─── Helpers ──────────────────────────────────────────────────────────────────


def send_approval_email(ad: Ad, owner: Profile):
    """Send an approval-request email to the admin via Resend."""
    if not settings.RESEND_API_KEY:
        print(f"[DEBUG] RESEND_API_KEY not configured, skipping email")
        return

    admin_email = settings.ADMIN_EMAIL
    base = settings.API_BASE_URL

    approve_url = f"{base}/admin/ads/{ad.id}/approve"
    reject_url = f"{base}/admin/ads/{ad.id}/reject"

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

    try:
        import resend

        resend.api_key = settings.RESEND_API_KEY

        # Use Resend's default onresend.dev domain (or verify your own in Resend dashboard)
        email = resend.Emails.send(
            {
                "from": "onboarding@resend.dev",  # Default Resend domain - change after verifying your domain
                "to": admin_email,
                "subject": f"[Ad Request] [{ad.ad_type.value.upper()}] {ad.title}",
                "html": html,
            }
        )
        print(f"[DEBUG] Email sent successfully. Response: {email}")
    except Exception as e:
        print(f"[ERROR] Failed to send approval email: {str(e)}")
        import traceback

        traceback.print_exc()
        print(
            f"[DEBUG] RESEND_API_KEY: {'SET' if settings.RESEND_API_KEY else 'NOT SET'}, ADMIN_EMAIL: {admin_email}"
        )


# ─── Schemas ──────────────────────────────────────────────────────────────────


class AdCreate(BaseModel):
    title: str
    body: str
    ad_type: Optional[str] = "post"  # "post" | "marketplace"
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
    owner = get_or_create_profile(user, db)
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
    owner = get_or_create_profile(user, db)
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
    db: Session = Depends(get_db),
    _=Depends(requires_admin),
):
    """Admin-only endpoint. Secured by JWT admin role."""

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
    db: Session = Depends(get_db),
    _=Depends(requires_admin),
):
    """Admin-only endpoint. Secured by JWT admin role."""

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
        "ad_type": ad.ad_type.value if ad.ad_type else None,
        "image": ad.image,
        "link_url": ad.link_url,
        "status": ad.status.value if ad.status else "pending",
        "owner_username": owner.username if owner else "unknown",
        "business_name": owner.business_name if owner else None,
        "created_at": ad.created_at.isoformat() if ad.created_at else "",
    }
