from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=200)
    content: str = Field(..., min_length=10)


class ReviewCreate(ReviewBase):
    product_id: int


class ReviewRead(ReviewBase):
    id: int
    user_id: UUID
    product_id: int
    created_at: datetime
    # We might want to include the username for display
    username: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
