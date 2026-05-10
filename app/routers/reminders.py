"""
app/routers/reminders.py
─────────────────────────
Endpoints for managing baking reminders.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.reminder import BakingReminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderRead

router = APIRouter(prefix="/reminders", tags=["Reminders"])

@router.get("/", response_model=list[ReminderRead])
async def get_reminders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetch all reminders for the current user."""
    result = await db.execute(
        select(BakingReminder)
        .where(BakingReminder.user_id == current_user.id)
        .order_by(BakingReminder.remind_at.asc())
    )
    return result.scalars().all()

@router.post("/", response_model=ReminderRead, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    schema: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new baking reminder."""
    reminder = BakingReminder(**schema.model_dump(), user_id=current_user.id)
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder

@router.patch("/{reminder_id}", response_model=ReminderRead)
async def update_reminder(
    reminder_id: UUID,
    schema: ReminderUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a reminder."""
    result = await db.execute(
        select(BakingReminder).where(
            BakingReminder.id == reminder_id, 
            BakingReminder.user_id == current_user.id
        )
    )
    reminder = result.scalar_one_or_none()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    data = schema.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(reminder, key, value)
    
    await db.commit()
    await db.refresh(reminder)
    return reminder

@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a reminder."""
    result = await db.execute(
        select(BakingReminder).where(
            BakingReminder.id == reminder_id, 
            BakingReminder.user_id == current_user.id
        )
    )
    reminder = result.scalar_one_or_none()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    await db.delete(reminder)
    await db.commit()
