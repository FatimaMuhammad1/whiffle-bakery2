"""
app/routers/categories.py
──────────────────────────
Endpoints for Category management.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.product_service import ProductService
from app.schemas.category import CategoryRead, CategoryCreate

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=List[CategoryRead])
async def list_categories(db: AsyncSession = Depends(get_db)):
    """Retrieve all product categories."""
    return await ProductService.get_all_categories(db)


@router.post("/", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(
    schema: CategoryCreate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new category. 
    (Future: Add Admin-only dependency here)
    """
    return await ProductService.create_category(db, schema)
