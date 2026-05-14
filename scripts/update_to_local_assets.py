import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def update_all_images():
    async with AsyncSessionLocal() as session:
        slug_to_image = {
            "classic-vanilla-cupcakes": "/assets/recipes/recipe-1.jpg",
            "chocolate-lava-cake": "/assets/recipes/recipe-2.jpg",
            "sourdough-bread": "/assets/recipes/recipe-3.jpg",
            "classic-sugar-cookies": "/assets/recipes/recipe-4.jpg",
            "banana-bread": "/assets/recipes/recipe-5.jpg",
            "french-macarons": "/assets/recipes/recipe-6.jpg",
            "cinnamon-rolls": "/assets/recipes/recipe-7.jpg",
            "blueberry-muffins": "/assets/recipes/recipe-8.jpg",
            "new-york-cheesecake": "/assets/recipes/recipe-9.jpg",
            "chocolate-chip-cookies": "/assets/recipes/recipe-10.jpg",
        }
        
        res = await session.execute(select(Recipe))
        recipes = res.scalars().all()
        
        for r in recipes:
            if r.slug in slug_to_image:
                r.image_url = slug_to_image[r.slug]
                
        await session.commit()
        print("Updated all recipes to use local assets.")

if __name__ == "__main__":
    asyncio.run(update_all_images())
