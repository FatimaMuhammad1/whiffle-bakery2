from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.wishlist import WishlistItem
from app.schemas.product import ProductRead

router = APIRouter(prefix="/wishlists", tags=["Wishlists"])


@router.get("/", response_model=List[ProductRead])
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get the current user's wishlist items."""
    # Fetch wishlist items ordered by added_at descending
    stmt = (
        select(WishlistItem)
        .where(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.added_at.desc())
        .options(selectinload(WishlistItem.product))
    )
    result = await db.execute(stmt)
    wishlist_items = result.scalars().all()
    
    # Return the associated products
    products = [item.product for item in wishlist_items if item.product]
    return products


@router.post("/{product_id}")
async def add_to_wishlist(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a product to the user's wishlist."""
    # Check if product exists
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if already in wishlist
    stmt = select(WishlistItem).where(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    )
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        return {"message": "Product already in wishlist"}

    # Add to wishlist
    new_item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(new_item)
    await db.commit()
    
    return {"message": "Product added to wishlist"}


@router.delete("/{product_id}")
async def remove_from_wishlist(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove a product from the user's wishlist."""
    stmt = select(WishlistItem).where(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    )
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    
    if item:
        await db.delete(item)
        await db.commit()
        
    return {"message": "Product removed from wishlist"}
