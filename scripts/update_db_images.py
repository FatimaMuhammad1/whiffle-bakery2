import asyncio
from app.database import AsyncSessionLocal
from app.models.product import Product
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def update_image_urls():
    async with AsyncSessionLocal() as session:
        # Update Products
        print("Updating Products...")
        res = await session.execute(select(Product))
        products = res.scalars().all()
        for p in products:
            if p.image_url and p.image_url.startswith("/src/assets/"):
                p.image_url = p.image_url.replace("/src/assets/", "/assets/")
        
        # Update Recipes
        print("Updating Recipes...")
        res = await session.execute(select(Recipe))
        recipes = res.scalars().all()
        for r in recipes:
            if r.image_url and r.image_url.startswith("/src/assets/"):
                r.image_url = r.image_url.replace("/src/assets/", "/assets/")
                
        await session.commit()
        print("Successfully updated all image URLs to public assets paths.")

if __name__ == "__main__":
    asyncio.run(update_image_urls())
