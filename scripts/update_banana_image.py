import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def update_banana():
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(Recipe).filter_by(slug="banana-bread"))
        r = res.scalars().first()
        if r:
            r.image_url = "https://images.unsplash.com/photo-1557310717-d6bea9f36682?w=600&auto=format&fit=crop&q=80"
            await session.commit()
            print("Successfully updated Banana Bread image.")
        else:
            print("Could not find banana bread.")

if __name__ == "__main__":
    asyncio.run(update_banana())
