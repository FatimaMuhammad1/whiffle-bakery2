"""
app/routers/products.py
────────────────────────
Endpoints for Product management.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.product_service import ProductService
from app.schemas.product import ProductRead, ProductCreate, ProductUpdate, ProductList
from app.dependencies.admin import admin_required

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=ProductList)
async def list_products(
    category_id: Optional[int] = Query(None),
    q: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve products with pagination, category filtering, and search."""
    items = await ProductService.get_all_products(db, skip, limit, category_id, q)
    total = await ProductService.count_products(db, category_id, q)
    return {"items": items, "total": total}


@router.get("/{slug}", response_model=ProductRead)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a single product by its slug."""
    product = await ProductService.get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found"
        )
    return product


@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(
    schema: ProductCreate, 
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    """
    Create a new product.
    (Future: Add Admin-only dependency here)
    """
    return await ProductService.create_product(db, schema)


@router.patch("/{product_id}", response_model=ProductRead)
async def update_product(
    product_id: int, 
    schema: ProductUpdate, 
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    """Update an existing product."""
    product = await ProductService.update_product(db, product_id, schema)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int, 
    db: AsyncSession = Depends(get_db),
    _ = Depends(admin_required)
):
    """Delete a product."""
    success = await ProductService.delete_product(db, product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return None
