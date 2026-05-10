import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def delete_fake_recipes():
    async with AsyncSessionLocal() as session:
        fake_slugs = [
            "grandmas-classic-sourdough",
            "10-minute-berry-scones",
            "dark-chocolate-espresso-brownies"
        ]
        
        res = await session.execute(select(Recipe).filter(Recipe.slug.in_(fake_slugs)))
        fake_recipes = res.scalars().all()
        
        for r in fake_recipes:
            await session.delete(r)
            
        await session.commit()
        print(f"Deleted {len(fake_recipes)} fake recipes.")

if __name__ == "__main__":
    asyncio.run(delete_fake_recipes())
