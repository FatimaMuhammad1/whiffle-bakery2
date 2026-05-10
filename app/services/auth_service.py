"""
app/services/auth_service.py
────────────────────────────
Business logic for User authentication and registration.
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.auth import LoginRequest
from app.utils.security import get_password_hash, verify_password


from app.models.otp import OTPPurpose
from app.services.otp_service import OTPService


class AuthService:
    @staticmethod
    async def signup(db: AsyncSession, schema: UserCreate) -> tuple[User, str]:
        """Register a new user and generate an initial verification OTP."""
        # Check if email exists
        # WHY: Email must be unique to identify the account and handle password resets.
        email_check = await db.execute(select(User).where(User.email == schema.email))
        if email_check.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists."
            )

        # Check if username exists
        # WHY: Usernames are public identifiers (used in profiles) and must be unique.
        username_check = await db.execute(select(User).where(User.username == schema.username))
        if username_check.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this username already exists."
            )

        # Create new user
        user_data = schema.model_dump()
        password = user_data.pop("password")
        # WHY: We hash the password before saving. 
        # We NEVER store plain-text passwords in the database.
        hashed_password = get_password_hash(password)
        
        new_user = User(**user_data, hashed_password=hashed_password)
        db.add(new_user)
        # WHY: We flush here to generate the user.id so we can link the OTP to it 
        # before the final commit.
        await db.flush()
        
        # Generate OTP
        # WHY: Verification ensures the user provided a real email address 
        # and prevents spam registrations.
        raw_otp = await OTPService.create_otp(db, new_user.id, OTPPurpose.email_verify)
        
        await db.commit()
        await db.refresh(new_user)
        
        return new_user, raw_otp

    @staticmethod
    async def authenticate_user(db: AsyncSession, schema: LoginRequest) -> User:
        """Verify user credentials and return user object if valid."""
        result = await db.execute(select(User).where(User.email == schema.email))
        user = result.scalar_one_or_none()
        
        # WHY: If user not found, we use a generic error message. 
        # This prevents "User Enumeration" attacks where a hacker can figure out 
        # which emails are registered by trying them one by one.
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        
        # WHY: verify_password takes the raw input and compares it against the stored hash 
        # using a secure algorithm (bcrypt).
        if not verify_password(schema.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
            
        # WHY: If an account is suspended (is_active=False), we block login 
        # without deleting their data.
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is inactive",
            )
            
        return user

    @staticmethod
    async def update_user(db: AsyncSession, user: User, schema: UserUpdate) -> tuple[User, Optional[str]]:
        """Update user profile fields. Returns (user, otp) if email verification is needed."""
        data = schema.model_dump(exclude_unset=True)
        raw_otp = None
        
        if "password" in data:
            data["hashed_password"] = get_password_hash(data.pop("password"))
        
        if "email" in data and data["email"] != user.email:
            # Check if new email is already taken
            email_check = await db.execute(select(User).where(User.email == data["email"]))
            if email_check.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A user with this email already exists."
                )
            
            # If email changes, set is_verified to False and generate OTP
            # WHY: This prevents users from switching to a fake or unowned email 
            # and potentially bypassing security or losing access.
            user.is_verified = False
            raw_otp = await OTPService.create_otp(db, user.id, OTPPurpose.email_verify)
            
        if "username" in data and data["username"] != user.username:
            # Check if new username is already taken
            username_check = await db.execute(select(User).where(User.username == data["username"]))
            if username_check.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A user with this username already exists."
                )

        for key, value in data.items():
            setattr(user, key, value)
            
        await db.commit()
        await db.refresh(user)
        return user, raw_otp

    @staticmethod
    async def delete_user(db: AsyncSession, user: User):
        """Permanently delete user account."""
        await db.delete(user)
        await db.commit()
