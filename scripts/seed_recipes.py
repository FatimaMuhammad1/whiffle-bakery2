import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def seed_recipes():
    async with AsyncSessionLocal() as session:
        # Check if recipes already exist
        res = await session.execute(select(Recipe))
        if len(res.scalars().all()) > 0:
            print("Recipes already seeded!")
            return

        recipes_to_add = [
            Recipe(
                title="Grandma's Classic Sourdough",
                slug="grandmas-classic-sourdough",
                description="A tangy, crusty sourdough loaf passed down through generations. The secret is in the starter.",
                content="""### Ingredients
- 500g Bread Flour
- 350g Water
- 100g Active Sourdough Starter
- 10g Fine Sea Salt

### Instructions
1. **Mix**: Combine flour and water. Let rest for 30 minutes (autolyse).
2. **Add Starter & Salt**: Dimple in the starter and salt. Mix until combined.
3. **Bulk Ferment**: Fold dough every 30 minutes for 2 hours. Let rest until doubled.
4. **Shape**: Shape into a boule and place in a banneton.
5. **Proof**: Retard in the fridge overnight.
6. **Bake**: Bake at 450°F (230°C) in a Dutch oven for 20 minutes covered, then 20 minutes uncovered.""",
                image_url="https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=600",
                prep_time="4 hours",
                cook_time="40 mins",
                difficulty="advanced",
                servings=1
            ),
            Recipe(
                title="10-Minute Berry Scones",
                slug="10-minute-berry-scones",
                description="Quick, buttery scones bursting with seasonal berries. Perfect for a sudden afternoon tea.",
                content="""### Ingredients
- 2 cups All-Purpose Flour
- 1/4 cup Sugar
- 1 tbsp Baking Powder
- 1/2 tsp Salt
- 6 tbsp Cold Butter, cubed
- 3/4 cup Heavy Cream
- 1 cup Fresh Berries

### Instructions
1. **Preheat**: Oven to 400°F (200°C).
2. **Dry Ingredients**: Whisk flour, sugar, baking powder, and salt.
3. **Cut in Butter**: Work butter into the flour mixture until it resembles coarse crumbs.
4. **Add Cream & Berries**: Gently fold in cream and berries until a shaggy dough forms.
5. **Shape & Cut**: Pat into a 1-inch thick circle. Cut into 8 wedges.
6. **Bake**: Bake for 15-18 minutes until golden brown.""",
                image_url="https://images.unsplash.com/photo-1484723091792-c1fa1740751a?auto=format&fit=crop&q=80&w=600",
                prep_time="10 mins",
                cook_time="15 mins",
                difficulty="beginner",
                servings=8
            ),
            Recipe(
                title="Dark Chocolate Espresso Brownies",
                slug="dark-chocolate-espresso-brownies",
                description="Fudgy, rich brownies with a kick of espresso. The ultimate late-night baking treat.",
                content="""### Ingredients
- 1 cup Butter
- 8 oz Dark Chocolate (70%+)
- 1.5 cups Sugar
- 4 Eggs
- 1/4 cup Cocoa Powder
- 1 cup Flour
- 1 tbsp Espresso Powder
- 1 tsp Vanilla Extract
- 1/2 tsp Salt

### Instructions
1. **Preheat & Prep**: Oven to 350°F (175°C). Line a 9x9 inch pan.
2. **Melt**: Melt butter and chocolate together over a double boiler.
3. **Whisk Eggs & Sugar**: Whisk eggs and sugar vigorously until pale and fluffy.
4. **Combine**: Fold the chocolate mixture into the eggs. Add vanilla.
5. **Dry Ingredients**: Sift in flour, cocoa powder, espresso powder, and salt. Fold gently.
6. **Bake**: Pour into the pan and bake for 25-30 minutes. Let cool completely before slicing.""",
                image_url="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
                prep_time="20 mins",
                cook_time="30 mins",
                difficulty="intermediate",
                servings=16
            )
        ]

        session.add_all(recipes_to_add)
        await session.commit()
        print(f"Successfully seeded {len(recipes_to_add)} recipes!")

if __name__ == "__main__":
    asyncio.run(seed_recipes())
