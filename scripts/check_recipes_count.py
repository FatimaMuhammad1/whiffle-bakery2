import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def count():
    async with AsyncSessionLocal() as s:
        res = await s.execute(select(Recipe))
        print('RECIPES COUNT:', len(res.scalars().all()))

asyncio.run(count())
