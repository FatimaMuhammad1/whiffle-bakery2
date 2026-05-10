"""
app/schemas/auth.py
───────────────────
Pydantic schemas for Authentication requests and responses.
"""
from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    type: Optional[str] = None


class MessageResponse(BaseModel):
    message: str


class LoginResponse(BaseModel):
    message: str
    two_factor_required: bool = False
    email: Optional[EmailStr] = None
