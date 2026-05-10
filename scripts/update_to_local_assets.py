import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def update_all_images():
    async with AsyncSessionLocal() as session:
        slug_to_image = {
            "classic-vanilla-cupcakes": "/src/assets/recipes/recipe-1.jpg",
            "chocolate-lava-cake": "/src/assets/recipes/recipe-2.jpg",
            "sourdough-bread": "/src/assets/recipes/recipe-3.jpg",
            "classic-sugar-cookies": "/src/assets/recipes/recipe-4.jpg",
            "banana-bread": "/src/assets/recipes/recipe-5.jpg",
            "french-macarons": "/src/assets/recipes/recipe-6.jpg",
            "cinnamon-rolls": "/src/assets/recipes/recipe-7.jpg",
            "blueberry-muffins": "/src/assets/recipes/recipe-8.jpg",
            "new-york-cheesecake": "/src/assets/recipes/recipe-9.jpg",
            "chocolate-chip-cookies": "/src/assets/recipes/recipe-10.jpg",
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
