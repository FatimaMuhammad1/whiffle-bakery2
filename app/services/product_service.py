"""
app/services/product_service.py
───────────────────────────────
Business logic for Product and Category operations.
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func, or_
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.category import CategoryCreate, CategoryUpdate


class ProductService:
    @staticmethod
    async def get_all_categories(db: AsyncSession) -> List[Category]:
        result = await db.execute(select(Category))
        return list(result.scalars().all())

    @staticmethod
    async def create_category(db: AsyncSession, schema: CategoryCreate) -> Category:
        new_cat = Category(**schema.model_dump())
        db.add(new_cat)
        await db.commit()
        await db.refresh(new_cat)
        return new_cat

    @staticmethod
    async def get_all_products(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100,
        category_id: Optional[int] = None,
        q: Optional[str] = None
    ) -> List[Product]:
        query = select(Product).offset(skip).limit(limit)
        if category_id:
            query = query.where(Product.category_id == category_id)
        if q:
            search_pattern = f"%{q}%"
            query = query.where(
                or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern)
                )
            )
        
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_product_by_slug(db: AsyncSession, slug: str) -> Optional[Product]:
        result = await db.execute(select(Product).where(Product.slug == slug))
        return result.scalar_one_or_none()

    @staticmethod
    async def create_product(db: AsyncSession, schema: ProductCreate) -> Product:
        new_product = Product(**schema.model_dump())
        db.add(new_product)
        await db.commit()
        await db.refresh(new_product)
        return new_product

    @staticmethod
    async def update_product(db: AsyncSession, product_id: int, schema: ProductUpdate) -> Optional[Product]:
        # Use a dictionary of non-None values to update
        data = schema.model_dump(exclude_unset=True)
        if not data:
            return None
            
        query = (
            update(Product)
            .where(Product.id == product_id)
            .values(**data)
            .returning(Product)
        )
        result = await db.execute(query)
        await db.commit()
        return result.scalar_one_or_none()

    @staticmethod
    async def delete_product(db: AsyncSession, product_id: int) -> bool:
        query = delete(Product).where(Product.id == product_id)
        result = await db.execute(query)
        await db.commit()
        return result.rowcount > 0

    @staticmethod
    async def count_products(db: AsyncSession, category_id: Optional[int] = None, q: Optional[str] = None) -> int:
        query = select(func.count(Product.id))
        if category_id:
            query = query.where(Product.category_id == category_id)
        if q:
            search_pattern = f"%{q}%"
            query = query.where(
                or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern)
                )
            )
        result = await db.execute(query)
        return result.scalar_one()
