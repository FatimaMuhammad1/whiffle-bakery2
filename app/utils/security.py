"""
app/utils/security.py
──────────────────────
Password hashing and JWT token management.
"""
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional

import bcrypt
from jose import jwt
from app.config import settings

# ── Password Hashing ──────────────────────────────────────────────────────────
# WHY: passlib is unmaintained and crashes with bcrypt>=4.1.
# Using bcrypt directly is simpler and fully supported.


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if the plain password matches the hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def get_password_hash(password: str) -> str:
    """Generate a bcrypt hash from a plain password."""
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


# ── JWT Tokens ────────────────────────────────────────────────────────────────
def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Creates a JWT access token.
    'subject' is usually the user ID (UUID as string).
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.JWT_ACCESS_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except Exception:
        return None
