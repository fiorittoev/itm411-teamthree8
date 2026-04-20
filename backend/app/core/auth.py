from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from app.core.config import settings

security = HTTPBearer()
_jwks_cache = None


async def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
            )
            r.raise_for_status()
            _jwks_cache = r.json()
    return _jwks_cache


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    try:
        header = jwt.get_unverified_header(token)
        print(f"[DEBUG] JWT header: {header}")

        jwks = await get_jwks()
        print(f"[DEBUG] JWKS keys: {[k.get('kid') for k in jwks.get('keys', [])]}")
        print(f"[DEBUG] Looking for kid: {header.get('kid')}")

        key = next((k for k in jwks["keys"] if k["kid"] == header.get("kid")), None)
        if not key:
            print(f"[DEBUG] No matching key found for kid: {header.get('kid')}")
            raise HTTPException(status_code=401, detail="No matching key found")

        # Validate token is properly signed
        try:
            unverified_payload = jwt.decode(
                token, "", options={"verify_signature": False}
            )
            print(f"[DEBUG] JWT aud claim: {unverified_payload.get('aud')}")
            print(f"[DEBUG] Full JWT payload keys: {list(unverified_payload.keys())}")
        except Exception as e:
            print(f"[DEBUG] Error decoding unverified: {e}")

        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            options={"verify_aud": False},
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Missing sub")

        # Extract admin role from JWT claims (set during user creation/registration)
        payload["is_admin"] = payload.get("custom_claims", {}).get("is_admin", False)
        print(f"[DEBUG] Successfully authenticated user: {user_id}")
        return payload

    except JWTError as e:
        print(f"[DEBUG] JWT Error: {e}")
        print(f"[DEBUG] Error type: {type(e).__name__}")
        print(f"[DEBUG] Full error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
