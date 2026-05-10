from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.review import ProductReview
from app.schemas.review import ReviewRead, ReviewCreate

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/{product_id}", response_model=List[ReviewRead])
async def get_product_reviews(
    product_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all reviews for a specific product."""
    stmt = (
        select(ProductReview)
        .where(ProductReview.product_id == product_id)
        .order_by(ProductReview.created_at.desc())
        .options(joinedload(ProductReview.user))
    )
    result = await db.execute(stmt)
    reviews = result.scalars().all()
    
    # Map to schema and include username
    res = []
    for r in reviews:
        read = ReviewRead.model_validate(r)
        read.username = r.user.username if r.user else "Anonymous"
        res.append(read)
    
    return res


@router.post("/", response_model=ReviewRead)
async def create_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit a new review for a product."""
    # Check if product exists
    result = await db.execute(select(Product).where(Product.id == review_in.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if user already reviewed this product
    stmt = select(ProductReview).where(
        ProductReview.user_id == current_user.id,
        ProductReview.product_id == review_in.product_id
    )
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400, 
            detail="You have already reviewed this product"
        )

    new_review = ProductReview(
        user_id=current_user.id,
        **review_in.model_dump()
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    
    read = ReviewRead.model_validate(new_review)
    read.username = current_user.username
    return read
