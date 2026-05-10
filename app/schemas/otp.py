"""
app/schemas/otp.py
──────────────────
Pydantic schemas for OTP verification.
"""
from pydantic import BaseModel, Field, EmailStr
from app.models.otp import OTPPurpose


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=4, max_length=10)
    purpose: OTPPurpose = OTPPurpose.email_verify


class ResendOTPRequest(BaseModel):
    email: EmailStr


class OTPResponse(BaseModel):
    message: str
