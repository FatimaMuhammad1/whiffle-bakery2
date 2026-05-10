import asyncio
from app.database import AsyncSessionLocal
from sqlalchemy import select
from app.models.recipe import Recipe

async def check():
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(Recipe))
        recipes = res.scalars().all()
        print(f"Total recipes: {len(recipes)}")
        for r in recipes:
            print(r.title)

if __name__ == "__main__":
    asyncio.run(check())
