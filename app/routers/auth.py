"""
app/routers/auth.py
───────────────────
Authentication endpoints with HttpOnly Cookie support.
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.config import settings
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.schemas.auth import LoginRequest, MessageResponse, LoginResponse, Token, TokenPayload, ForgotPasswordRequest, ResetPasswordRequest, Verify2FAResponse
from app.schemas.otp import OTPVerifyRequest, OTPResponse, ResendOTPRequest
from app.models.otp import OTPPurpose
from app.services.otp_service import OTPService
from app.services.email_service import EmailService
from app.utils.security import create_access_token

from app.dependencies.auth import get_current_user
from app.dependencies.admin import admin_required
from app.models.user import User
from app.utils.rate_limiter import rate_limit
from typing import List

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/users", response_model=List[UserRead])
async def list_users(
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    """List all users (Admin only)."""
    from sqlalchemy import select
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    return result.scalars().all()

COOKIE_NAME = "access_token"


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged-in user profile."""
    return current_user


@router.patch("/me", response_model=dict)
async def update_me(
    schema: UserUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user profile.
    If email is changed, a verification OTP is sent to the new address.
    """
    user, otp = await AuthService.update_user(db, current_user, schema)
    
    message = "Profile updated successfully."
    if otp:
        background_tasks.add_task(EmailService.send_otp_email, user.email, otp)
        message = "Profile updated. Please check your new email for a verification code."
    
    return {
        "user": UserRead.model_validate(user),
        "message": message,
        "verification_required": otp is not None
    }


@router.delete("/me", response_model=MessageResponse)
async def delete_me(
    response: Response,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete current user account."""
    await AuthService.delete_user(db, current_user)
    # Clear the cookie as well
    response.delete_cookie(
        key="access_token",
        samesite="lax",
        secure=False,
        path="/",
    )
    return {"message": "Account deleted successfully"}


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(
    schema: UserCreate, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _ = Depends(rate_limit)
):
    """
    Register a new user and send a verification OTP via email.
    """
    user, otp = await AuthService.signup(db, schema)
    
    # Send email in the background
    background_tasks.add_task(EmailService.send_otp_email, user.email, otp)
    
    return {
        "user": UserRead.model_validate(user),
        "message": "User created. Please check your email for the OTP code."
    }


@router.post("/login", response_model=LoginResponse)
async def login(
    schema: LoginRequest, 
    response: Response, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _ = Depends(rate_limit)
):
    """
    Authenticate user and check for 2FA requirement.
    """
    user = await AuthService.authenticate_user(db, schema)
    
    # Check for 2FA
    if user.two_factor_enabled:
        # Generate 2FA OTP
        otp = await OTPService.create_otp(db, user.id, OTPPurpose.login_2fa)
        # Send email
        background_tasks.add_task(EmailService.send_otp_email, user.email, otp)
        
        return {
            "message": "Two-factor authentication required. Please check your email for the code.",
            "two_factor_required": True,
            "email": user.email
        }

    # Normal Login
    access_token_expires = (
        timedelta(days=settings.JWT_REFRESH_EXPIRE_DAYS)
        if schema.remember_me
        else timedelta(minutes=settings.JWT_ACCESS_EXPIRE_MINUTES)
    )
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    cookie_max_age = int(access_token_expires.total_seconds())
    
    response.set_cookie(
        key=COOKIE_NAME,
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=cookie_max_age,
        expires=cookie_max_age,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/",
    )
    
    return {
        "message": "Successfully logged in",
        "two_factor_required": False,
        "user": UserRead.model_validate(user)
    }


@router.post("/verify-2fa", response_model=Verify2FAResponse)
async def verify_2fa(
    schema: OTPVerifyRequest, 
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Verify the 2FA code and complete the login.
    """
    # 1. Find user by email
    from app.models.user import User
    from sqlalchemy import select
    
    result = await db.execute(select(User).where(User.email == schema.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Verify OTP for 2FA
    await OTPService.verify_otp(db, user.id, schema.code, OTPPurpose.login_2fa)
    
    # 3. Create session
    access_token_expires = (
        timedelta(days=settings.JWT_REFRESH_EXPIRE_DAYS)
        if schema.remember_me
        else timedelta(minutes=settings.JWT_ACCESS_EXPIRE_MINUTES)
    )
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    cookie_max_age = int(access_token_expires.total_seconds())
    
    response.set_cookie(
        key=COOKIE_NAME,
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=cookie_max_age,
        expires=cookie_max_age,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/",
    )
    
    return {
        "message": "Two-factor authentication successful",
        "user": UserRead.model_validate(user)
    }


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response):
    """
    Clear the authentication cookie.
    
    WHY: Logging out is as simple as telling the browser to delete the cookie. 
    Since the server is stateless (JWT), we don't need to update the DB, 
    but we do this to clear the client session.
    """
    response.delete_cookie(
        key=COOKIE_NAME,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/",
    )
    return {"message": "Successfully logged out"}


@router.post("/verify-otp", response_model=OTPResponse)
async def verify_otp(schema: OTPVerifyRequest, db: AsyncSession = Depends(get_db)):
    """
    Verify an OTP code for a user (by email).
    
    WHY: OTP (One-Time Password) verification is used to confirm that the user 
    actually owns the email address they signed up with, preventing fake accounts.
    """
    # 1. Find user by email
    from app.models.user import User
    from sqlalchemy import select
    
    result = await db.execute(select(User).where(User.email == schema.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Verify OTP
    await OTPService.verify_otp(db, user.id, schema.code, schema.purpose)
    
    # 3. Mark user as verified
    # WHY: Once verified, the user gains access to protected features like Checkout.
    user.is_verified = True
    await db.commit()
    
    return {"message": "Email verified successfully"}


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    schema: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _ = Depends(rate_limit)
):
    """
    Send an OTP for password reset to the specified email address.
    
    WHY: To prevent user enumeration attacks, we return a successful message
    regardless of whether the email exists in our system. But we only send the email
    if the user is found.
    """
    from app.models.user import User
    from sqlalchemy import select
    
    result = await db.execute(select(User).where(User.email == schema.email))
    user = result.scalar_one_or_none()
    
    if user:
        # Generate reset password OTP
        otp = await OTPService.create_otp(db, user.id, OTPPurpose.password_reset)
        # Send password reset email in the background
        background_tasks.add_task(EmailService.send_password_reset_email, user.email, otp)
        
    return {"message": "If a matching account is found, an OTP code has been sent to that email address."}


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    schema: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
    _ = Depends(rate_limit)
):
    """
    Verify the reset password OTP and update user's password.
    """
    from app.models.user import User
    from sqlalchemy import select
    from app.utils.security import get_password_hash
    
    # 1. Find user by email
    result = await db.execute(select(User).where(User.email == schema.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Verify OTP
    await OTPService.verify_otp(db, user.id, schema.code, OTPPurpose.password_reset)
    
    # 3. Hash new password and save
    hashed_password = get_password_hash(schema.new_password)
    user.hashed_password = hashed_password
    await db.commit()
    
    return {"message": "Password reset successfully. You can now log in with your new password."}


