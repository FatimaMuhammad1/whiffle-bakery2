"""
app/dependencies/auth.py
────────────────────────
Authentication dependencies to protect routes.
"""
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User, UserRole
from app.utils.security import decode_token
from app.schemas.auth import TokenPayload

COOKIE_NAME = "access_token"


async def get_current_user(
    request: Request, 
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency that extracts the JWT from the cookie and returns the current User.
    
    WHY: This dependency allows us to protect any route just by adding 
    'user: User = Depends(get_current_user)' to the function parameters.
    It centralizes the authentication logic in one place.
    """
    # WHY: We look for the 'access_token' cookie. 
    # This is more secure than looking in the 'Authorization' header because 
    # browser cookies can be marked as HttpOnly.
    token_cookie = request.cookies.get(COOKIE_NAME)
    
    if not token_cookie:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    
    # Cookie value format is "Bearer <token>"
    # WHY: We follow the standard 'Bearer' scheme to stay compatible with 
    # common library expectations, even though we are using cookies.
    try:
        scheme, token = token_cookie.split(" ")
        if scheme.lower() != "bearer":
            raise ValueError()
    except (ValueError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme",
        )
        
    # WHY: decode_token checks the signature and expiration. 
    # If the token was tampered with, this will fail.
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
        
    token_data = TokenPayload(**payload)
    
    # Get user from DB
    # WHY: We fetch the user from the database to ensure they haven't been 
    # deleted or deactivated since the token was issued.
    result = await db.execute(select(User).where(User.id == token_data.sub))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
        
    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency that ensures the user has Admin privileges.
    
    WHY: Some routes (like adding new products) should only be accessible by staff. 
    This dependency builds on top of get_current_user to check the user's role.
    """
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Admin role required.",
        )
    return current_user
