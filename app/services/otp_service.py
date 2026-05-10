"""
app/services/otp_service.py
────────────────────────────
Logic for generating, storing, and verifying OTP codes.
"""
import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from fastapi import HTTPException, status

from app.models.otp import OTPCode, OTPPurpose
from app.utils.security import get_password_hash, verify_password
from app.config import settings


class OTPService:
    @staticmethod
    def _generate_numeric_code(length: int = 6) -> str:
        """
        Generates a random numeric string of given length.
        
        WHY: We use 'secrets.choice' instead of 'random.choice' because 
        'secrets' is cryptographically secure, making the OTPs much harder 
        to predict or brute-force.
        """
        return "".join(secrets.choice(string.digits) for _ in range(length))

    @staticmethod
    async def create_otp(
        db: AsyncSession, 
        user_id: str, 
        purpose: OTPPurpose = OTPPurpose.email_verify
    ) -> str:
        """
        Creates a new OTP for a user.
        """
        # 1. Invalidate old codes
        # WHY: If a user requests a NEW code, all previous codes for the 
        # same purpose should become invalid immediately to prevent 
        # a user from having multiple active entry points.
        await db.execute(
            update(OTPCode)
            .where(OTPCode.user_id == user_id)
            .where(OTPCode.purpose == purpose)
            .where(OTPCode.is_used == False)
            .values(is_used=True)
        )

        # 2. Generate new code
        raw_code = OTPService._generate_numeric_code(settings.OTP_LENGTH)
        # WHY: We hash the code so it is secure even if the database is leaked.
        hashed_code = get_password_hash(raw_code)
        
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        
        new_otp = OTPCode(
            user_id=user_id,
            hashed_code=hashed_code,
            purpose=purpose,
            expires_at=expires_at,
            created_at=datetime.now(timezone.utc),
            is_used=False
        )
        
        db.add(new_otp)
        await db.commit()
        # WHY: We return the raw code here so it can be sent via email, 
        # but it is never saved to the DB in this form.
        return raw_code

    @staticmethod
    async def verify_otp(
        db: AsyncSession,
        user_id: str,
        raw_code: str,
        purpose: OTPPurpose
    ) -> bool:
        """
        Verifies an OTP code.
        """
        # Find the latest unused, non-expired OTP for this user and purpose
        # WHY: We check 'is_used=False' and 'expires_at > now' to ensure 
        # the code is still valid according to our business rules.
        now = datetime.now(timezone.utc)
        result = await db.execute(
            select(OTPCode)
            .where(OTPCode.user_id == user_id)
            .where(OTPCode.purpose == purpose)
            .where(OTPCode.is_used == False)
            .where(OTPCode.expires_at > now)
            .order_by(OTPCode.created_at.desc())
        )
        otp_record = result.scalars().first()

        if not otp_record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP code."
            )

        # Verify hash
        # WHY: Comparing the hash ensures the provided code matches what we sent.
        if not verify_password(raw_code, otp_record.hashed_code):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP code."
            )

        # Mark as used
        # WHY: A code MUST be marked as used immediately so it cannot be 
        # used a second time (replay protection).
        otp_record.is_used = True
        await db.commit()
        return True
