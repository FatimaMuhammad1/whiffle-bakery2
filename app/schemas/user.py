"""
app/schemas/user.py
───────────────────
Pydantic schemas for User models.
"""
from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    password: Optional[str] = Field(None, min_length=8, max_length=100)
    two_factor_enabled: Optional[bool] = None
    full_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None


class UserRead(UserBase):
    id: UUID
    role: UserRole
    is_active: bool
    is_verified: bool
    two_factor_enabled: bool
    points: int
    full_name: Optional[str]
    address: Optional[str]
    city: Optional[str]
    zip: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
