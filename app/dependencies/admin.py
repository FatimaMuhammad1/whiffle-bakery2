from fastapi import Depends, HTTPException, status
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole

async def admin_required(current_user: User = Depends(get_current_user)):
    """
    Dependency that ensures the current user is an administrator.
    """
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required to perform this action."
        )
    return current_user
