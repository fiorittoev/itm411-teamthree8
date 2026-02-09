from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    secret = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None)
    if not secret:
        raise HTTPException(status_code=500, detail="Auth not configured")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing sub")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
