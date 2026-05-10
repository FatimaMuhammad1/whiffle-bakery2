"""
app/schemas/reminder.py
────────────────────────
Pydantic schemas for BakingReminder models.
"""
from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ReminderBase(BaseModel):
    title: str
    description: Optional[str] = None
    remind_at: datetime

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    remind_at: Optional[datetime] = None
    is_completed: Optional[bool] = None

class ReminderRead(ReminderBase):
    id: UUID
    is_completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
