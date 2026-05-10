import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def update_images():
    async with AsyncSessionLocal() as session:
        # Sourdough
        res1 = await session.execute(select(Recipe).filter_by(slug="sourdough-bread"))
        r1 = res1.scalars().first()
        if r1:
            r1.image_url = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600"
            print("Updated Sourdough Bread")

        # Banana Bread
        res2 = await session.execute(select(Recipe).filter_by(slug="banana-bread"))
        r2 = res2.scalars().first()
        if r2:
            r2.image_url = "https://images.unsplash.com/photo-1622085352335-51fb67a57a31?auto=format&fit=crop&q=80&w=600"
            print("Updated Banana Bread")

        await session.commit()

if __name__ == "__main__":
    asyncio.run(update_images())
