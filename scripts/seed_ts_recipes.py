import asyncio
from app.database import AsyncSessionLocal
from app.models.recipe import Recipe
from sqlalchemy.future import select

async def seed_ts_recipes():
    recipes_data = [
        {
            "title": "Classic Vanilla Cupcakes",
            "slug": "classic-vanilla-cupcakes",
            "difficulty": "beginner",
            "time": "45 min",
            "servings": 12,
            "description": "Fluffy vanilla cupcakes with silky buttercream frosting. Perfect for beginners and a crowd favorite for any occasion.",
            "ingredients": [
              "1 1/2 cups all-purpose flour",
              "1 1/2 tsp baking powder",
              "1/4 tsp salt",
              "1/2 cup unsalted butter, softened",
              "3/4 cup granulated sugar",
              "2 large eggs",
              "2 tsp pure vanilla extract",
              "1/2 cup whole milk",
              "For frosting: 1 cup butter, 3 cups powdered sugar, 2 tbsp milk, 1 tsp vanilla"
            ],
            "steps": [
              "Preheat your oven to 350°F (175°C). Line a 12-cup muffin tin with cupcake liners.",
              "In a medium bowl, whisk together the flour, baking powder, and salt. Set aside.",
              "In a large bowl, beat the softened butter and sugar with an electric mixer until light and fluffy, about 3 minutes.",
              "Add eggs one at a time, beating well after each addition. Mix in the vanilla extract.",
              "Alternately add the flour mixture and milk to the butter mixture in three additions, beginning and ending with flour. Mix until just combined.",
              "Divide batter evenly among the prepared cups, filling each about 2/3 full.",
              "Bake for 18-22 minutes, or until a toothpick inserted in the center comes out clean.",
              "Let cool in the pan for 5 minutes, then transfer to a wire rack to cool completely.",
              "For the frosting: Beat butter until creamy, then gradually add powdered sugar. Add milk and vanilla, beat on high for 2-3 minutes until fluffy.",
              "Pipe or spread frosting onto cooled cupcakes. Decorate with sprinkles if desired."
            ],
            "image_url": "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "Chocolate Lava Cake",
            "slug": "chocolate-lava-cake",
            "difficulty": "intermediate",
            "time": "30 min",
            "servings": 4,
            "description": "Rich chocolate cake with a gooey molten center. An impressive dessert that is surprisingly easy to make.",
            "ingredients": [
              "4 oz semi-sweet chocolate, chopped",
              "1/2 cup unsalted butter",
              "1 cup powdered sugar",
              "2 large eggs",
              "2 egg yolks",
              "6 tbsp all-purpose flour",
              "Butter and cocoa powder for greasing ramekins",
              "Vanilla ice cream for serving (optional)"
            ],
            "steps": [
              "Preheat oven to 425°F (220°C). Grease 4 ramekins with butter and dust with cocoa powder.",
              "Melt chocolate and butter together in a microwave-safe bowl in 30-second intervals, stirring between each, until smooth.",
              "Stir in the powdered sugar until well combined.",
              "Add the eggs and egg yolks, whisking until smooth.",
              "Fold in the flour gently until just incorporated. Do not overmix.",
              "Divide batter evenly among the prepared ramekins.",
              "Place ramekins on a baking sheet and bake for exactly 12-14 minutes. The edges should be firm but the center will be soft.",
              "Let rest for 1 minute, then run a knife around the edges. Invert each onto a plate.",
              "Serve immediately while the center is still molten. Top with vanilla ice cream or powdered sugar."
            ],
            "image_url": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "Sourdough Bread",
            "slug": "sourdough-bread",
            "difficulty": "advanced",
            "time": "24 hrs",
            "servings": 1,
            "description": "Artisan sourdough bread with a crispy crust and chewy, tangy crumb. A rewarding project for dedicated bakers.",
            "ingredients": [
              "500g bread flour",
              "350g water (lukewarm)",
              "100g active sourdough starter",
              "10g sea salt",
              "Rice flour for dusting"
            ],
            "steps": [
              "In the morning, mix flour and water in a large bowl. Let rest (autolyse) for 30 minutes.",
              "Add the sourdough starter and salt. Mix by hand using the pinch-and-fold method for 5 minutes.",
              "Cover and let rest for 30 minutes. Perform a series of stretch-and-folds every 30 minutes for the next 2 hours (4 sets total).",
              "After the last fold, cover and let the dough bulk ferment at room temperature for 4-6 hours, until it has risen by about 50% and looks bubbly.",
              "Turn the dough out onto a lightly floured surface. Shape into a round (boule) by pulling edges to the center and flipping seam-side down.",
              "Place seam-side up into a floured banneton basket. Cover tightly and refrigerate overnight (12-14 hours).",
              "The next day, preheat your oven to 500°F (260°C) with a Dutch oven inside for at least 45 minutes.",
              "Turn the dough out onto parchment paper. Score the top with a bread lame in your desired pattern.",
              "Carefully lower into the hot Dutch oven. Cover with lid and bake for 20 minutes.",
              "Remove lid, reduce temperature to 450°F (230°C), and bake for another 20-25 minutes until deep golden brown.",
              "Remove from oven and let cool on a wire rack for at least 1 hour before slicing."
            ],
            "image_url": "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "Classic Sugar Cookies",
            "slug": "classic-sugar-cookies",
            "difficulty": "beginner",
            "time": "2 hrs",
            "servings": 24,
            "description": "Buttery, soft sugar cookies perfect for decorating with royal icing. Great for holidays and kids' activities.",
            "ingredients": [
              "3 cups all-purpose flour",
              "1 1/2 tsp baking powder",
              "1/4 tsp salt",
              "1 cup unsalted butter, softened",
              "1 cup granulated sugar",
              "1 large egg",
              "1 tsp vanilla extract",
              "1/2 tsp almond extract (optional)"
            ],
            "steps": [
              "Whisk together flour, baking powder, and salt in a bowl. Set aside.",
              "Beat butter and sugar until light and fluffy, about 3 minutes.",
              "Add egg, vanilla, and almond extract. Beat until combined.",
              "Gradually add the flour mixture, mixing on low until a dough forms.",
              "Divide dough in half, flatten into discs, wrap in plastic, and refrigerate for at least 1 hour.",
              "Preheat oven to 350°F (175°C). Line baking sheets with parchment paper.",
              "Roll dough out on a floured surface to 1/4-inch thickness.",
              "Cut into shapes with cookie cutters. Place on prepared sheets 1 inch apart.",
              "Bake for 8-10 minutes. The cookies should be set but not browned.",
              "Cool on the sheet for 5 minutes, then transfer to a wire rack."
            ],
            "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "Banana Bread",
            "slug": "banana-bread",
            "difficulty": "beginner",
            "time": "1 hr 15 min",
            "servings": 10,
            "description": "Moist and tender banana bread with a golden crust. The perfect way to use up overripe bananas.",
            "ingredients": [
              "3 large ripe bananas, mashed",
              "1/3 cup melted butter",
              "3/4 cup sugar",
              "1 large egg, beaten",
              "1 tsp vanilla extract",
              "1 tsp baking soda",
              "Pinch of salt",
              "1 1/2 cups all-purpose flour",
              "1/2 cup walnuts, chopped (optional)"
            ],
            "steps": [
              "Preheat oven to 350°F (175°C). Grease a 9x5-inch loaf pan.",
              "In a large bowl, mash the bananas with a fork until mostly smooth.",
              "Stir in the melted butter, sugar, egg, and vanilla.",
              "Sprinkle the baking soda and salt over the mixture. Stir to combine.",
              "Add the flour and fold gently until just incorporated. Fold in walnuts if using.",
              "Pour batter into the prepared loaf pan and spread evenly.",
              "Bake for 55-65 minutes, until a toothpick inserted in the center comes out clean.",
              "Let cool in pan for 10 minutes, then turn out onto a wire rack."
            ],
            "image_url": "https://images.unsplash.com/photo-1599508704512-2f19efd1eede?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "French Macarons",
            "slug": "french-macarons",
            "difficulty": "advanced",
            "time": "3 hrs",
            "servings": 24,
            "description": "Delicate almond meringue cookies with a smooth top, ruffled feet, and a creamy filling. A true test of baking skill.",
            "ingredients": [
              "1 3/4 cups powdered sugar",
              "1 cup almond flour, finely ground",
              "3 large egg whites, aged overnight at room temp",
              "1/4 cup granulated sugar",
              "1/2 tsp vanilla extract",
              "Gel food coloring (optional)",
              "For filling: 1/2 cup butter, 1 1/2 cups powdered sugar, 2 tbsp cream"
            ],
            "steps": [
              "Sift powdered sugar and almond flour together twice. Discard any large pieces.",
              "Beat egg whites on medium speed until foamy. Gradually add granulated sugar while beating.",
              "Continue beating until stiff, glossy peaks form. Add vanilla and food coloring if desired.",
              "Fold the almond mixture into the meringue in three additions using the macaronage technique. The batter should flow like lava and form a ribbon when lifted.",
              "Transfer batter to a piping bag fitted with a round tip. Pipe 1.5-inch circles onto parchment-lined baking sheets.",
              "Tap sheets firmly on the counter to release air bubbles. Pop any visible bubbles with a toothpick.",
              "Let shells rest at room temperature for 30-60 minutes until they form a skin. You should be able to touch them without sticking.",
              "Preheat oven to 300°F (150°C). Bake for 17-18 minutes, rotating halfway through.",
              "Let cool completely on the baking sheet before gently peeling off.",
              "Make the filling: beat butter until smooth, add powdered sugar gradually, then cream. Pipe filling onto one shell and sandwich with another.",
              "Refrigerate assembled macarons for 24 hours before serving for the best texture."
            ],
            "image_url": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "Cinnamon Rolls",
            "slug": "cinnamon-rolls",
            "difficulty": "intermediate",
            "time": "3 hrs",
            "servings": 12,
            "description": "Soft, pillowy cinnamon rolls smothered in cream cheese glaze. Weekend brunch perfection.",
            "ingredients": [
              "1 cup warm milk",
              "2 1/4 tsp active dry yeast",
              "1/4 cup granulated sugar",
              "1/3 cup melted butter",
              "1 tsp salt",
              "1 egg",
              "3 1/2 cups all-purpose flour",
              "Filling: 1/3 cup softened butter, 3/4 cup brown sugar, 2 tbsp cinnamon",
              "Glaze: 4 oz cream cheese, 1 cup powdered sugar, 2 tbsp milk, 1 tsp vanilla"
            ],
            "steps": [
              "Warm the milk to about 110°F. Stir in yeast and a pinch of sugar. Let sit for 10 minutes until bubbly.",
              "Add remaining sugar, melted butter, salt, and egg to the yeast mixture. Stir well.",
              "Gradually add flour, stirring until a soft dough forms. Knead on a floured surface for 5 minutes.",
              "Place dough in a greased bowl, cover, and let rise in a warm place for 1-1.5 hours until doubled.",
              "Punch down dough and roll out on a floured surface into a 16x12-inch rectangle.",
              "Spread softened butter over the dough, then sprinkle evenly with brown sugar and cinnamon.",
              "Roll up tightly from the long side. Cut into 12 equal pieces with a sharp knife or dental floss.",
              "Place rolls in a greased 9x13-inch baking dish, cut side up. Cover and let rise 30 minutes.",
              "Preheat oven to 375°F (190°C). Bake for 22-25 minutes until golden brown.",
              "While baking, beat together cream cheese, powdered sugar, milk, and vanilla for the glaze.",
              "Spread glaze generously over warm rolls. Serve immediately."
            ],
            "image_url": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "Blueberry Muffins",
            "slug": "blueberry-muffins",
            "difficulty": "beginner",
            "time": "35 min",
            "servings": 12,
            "description": "Bakery-style blueberry muffins with a golden sugar crust. Bursting with fresh blueberries in every bite.",
            "ingredients": [
              "2 cups all-purpose flour",
              "3/4 cup granulated sugar",
              "2 1/2 tsp baking powder",
              "1/2 tsp salt",
              "1/3 cup vegetable oil",
              "1 large egg",
              "1 cup milk",
              "1 1/2 cups fresh blueberries",
              "1 tbsp coarse sugar for topping"
            ],
            "steps": [
              "Preheat oven to 400°F (200°C). Line a 12-cup muffin tin with paper liners.",
              "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
              "In a separate bowl, whisk together oil, egg, and milk.",
              "Pour the wet ingredients into the dry ingredients. Stir until just barely combined. Batter should be lumpy.",
              "Gently fold in the blueberries. Toss them in a tablespoon of flour first to prevent sinking.",
              "Divide batter among muffin cups, filling each almost to the top for bakery-style domed muffins.",
              "Sprinkle coarse sugar over the tops.",
              "Bake for 20-25 minutes until golden and a toothpick comes out clean.",
              "Cool in pan for 5 minutes before transferring to a wire rack."
            ],
            "image_url": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "New York Cheesecake",
            "slug": "new-york-cheesecake",
            "difficulty": "intermediate",
            "time": "5 hrs",
            "servings": 12,
            "description": "Dense, creamy, and tangy classic New York-style cheesecake with a graham cracker crust.",
            "ingredients": [
              "Crust: 2 cups graham cracker crumbs, 1/4 cup sugar, 6 tbsp melted butter",
              "32 oz (4 blocks) cream cheese, softened",
              "1 cup granulated sugar",
              "1 tbsp vanilla extract",
              "2 tbsp all-purpose flour",
              "1 cup sour cream",
              "4 large eggs"
            ],
            "steps": [
              "Preheat oven to 325°F (160°C). Wrap the outside of a 9-inch springform pan with aluminum foil.",
              "Mix graham cracker crumbs, sugar, and melted butter. Press firmly into the bottom of the pan. Bake for 10 minutes.",
              "Beat cream cheese on medium until smooth and creamy, scraping the bowl often. No lumps allowed.",
              "Add sugar and vanilla, beat until combined. Mix in flour.",
              "Add sour cream and mix until smooth.",
              "Add eggs one at a time on low speed, mixing just until each is incorporated. Do not overbeat.",
              "Pour filling over the crust. Place the springform pan inside a larger roasting pan. Pour hot water into the roasting pan to come 1 inch up the sides (water bath).",
              "Bake for 60-70 minutes. The center should jiggle slightly like gelatin when gently shaken.",
              "Turn off the oven, crack the door open, and let the cheesecake cool inside for 1 hour.",
              "Remove from oven and water bath. Run a thin knife around the edge. Refrigerate for at least 4 hours, preferably overnight.",
              "Release from the springform pan. Slice with a hot, dry knife for clean cuts."
            ],
            "image_url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80"
        },
        {
            "title": "Chocolate Chip Cookies",
            "slug": "chocolate-chip-cookies",
            "difficulty": "beginner",
            "time": "45 min",
            "servings": 36,
            "description": "Crispy on the edges, chewy in the middle. The ultimate chocolate chip cookie recipe you will make again and again.",
            "ingredients": [
              "2 1/4 cups all-purpose flour",
              "1 tsp baking soda",
              "1 tsp salt",
              "1 cup (2 sticks) butter, softened",
              "3/4 cup granulated sugar",
              "3/4 cup packed brown sugar",
              "2 large eggs",
              "2 tsp vanilla extract",
              "2 cups semi-sweet chocolate chips"
            ],
            "steps": [
              "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
              "Whisk together flour, baking soda, and salt in a bowl.",
              "In a large bowl, beat butter and both sugars until creamy, about 3 minutes.",
              "Add eggs one at a time, then vanilla. Beat until well combined.",
              "Gradually stir in the flour mixture on low speed until just combined.",
              "Fold in the chocolate chips by hand.",
              "Drop rounded tablespoons of dough onto prepared sheets, 2 inches apart.",
              "Bake for 9-11 minutes until golden brown on the edges but still soft in the center.",
              "Let cool on the baking sheet for 5 minutes, then transfer to a wire rack."
            ],
            "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80"
        }
    ]

    async with AsyncSessionLocal() as session:
        # Check if recipes already exist
        res = await session.execute(select(Recipe))
        existing_slugs = {r.slug for r in res.scalars().all()}
        
        recipes_to_add = []
        for rd in recipes_data:
            if rd["slug"] not in existing_slugs:
                # Format content to Markdown
                content = "### Ingredients\n"
                for ing in rd["ingredients"]:
                    content += f"- {ing}\n"
                content += "\n### Instructions\n"
                for i, step in enumerate(rd["steps"]):
                    content += f"{i+1}. {step}\n"

                recipes_to_add.append(
                    Recipe(
                        title=rd["title"],
                        slug=rd["slug"],
                        description=rd["description"],
                        content=content,
                        image_url=rd["image_url"],
                        prep_time=rd["time"],
                        cook_time="",
                        difficulty=rd["difficulty"],
                        servings=rd["servings"]
                    )
                )

        if recipes_to_add:
            session.add_all(recipes_to_add)
            await session.commit()
            print(f"Successfully seeded {len(recipes_to_add)} recipes from recipes.ts!")
        else:
            print("All recipes already exist!")

if __name__ == "__main__":
    asyncio.run(seed_ts_recipes())
