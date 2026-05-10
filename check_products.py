import asyncio
from app.database import AsyncSessionLocal
from app.models.product import Product
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Product))
        products = res.scalars().all()
        for p in products:
            print(f"ID: {p.id}, Name: {p.name}")

if __name__ == "__main__":
    asyncio.run(check())
