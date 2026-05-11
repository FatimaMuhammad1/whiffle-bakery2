"""
app/schemas/product.py
───────────────────────
Pydantic schemas for Product models.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.schemas.category import CategoryRead


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=220)
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    stock_quantity: int = Field(default=0, ge=0)
    image_url: Optional[str] = Field(None, max_length=500)
    images: List[str] = Field(default_factory=list)
    is_available: bool = True
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    category_id: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    slug: Optional[str] = Field(None, min_length=1, max_length=220)
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = Field(None, max_length=500)
    is_available: Optional[bool] = None
    category_id: Optional[int] = None


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryRead] = None

    model_config = ConfigDict(from_attributes=True)


class ProductList(BaseModel):
    items: List[ProductRead]
    total: int
