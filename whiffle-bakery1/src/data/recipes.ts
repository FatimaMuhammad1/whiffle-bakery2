// ==================== RECIPE DATA ====================
// Contains 10 full recipes with ingredients, steps, and metadata
// Each recipe is viewable on the blog and has its own detail page
// ===========================================================

export type Recipe = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  servings: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  category: string;
};

// ---- Recipe Collection ----
export const recipes: Recipe[] = [
  // ---- Recipe 1: Classic Vanilla Cupcakes ----
  {
    id: "1",
    title: "Classic Vanilla Cupcakes",
    difficulty: "Easy",
    time: "45 min",
    servings: "12 cupcakes",
    description: "Fluffy vanilla cupcakes with silky buttercream frosting. Perfect for beginners and a crowd favorite for any occasion.",
    category: "Cupcakes",
    ingredients: [
      "1 1/2 cups all-purpose flour",
      "1 1/2 tsp baking powder",
      "1/4 tsp salt",
      "1/2 cup unsalted butter, softened",
      "3/4 cup granulated sugar",
      "2 large eggs",
      "2 tsp pure vanilla extract",
      "1/2 cup whole milk",
      "For frosting: 1 cup butter, 3 cups powdered sugar, 2 tbsp milk, 1 tsp vanilla",
    ],
    steps: [
      "Preheat your oven to 350°F (175°C). Line a 12-cup muffin tin with cupcake liners.",
      "In a medium bowl, whisk together the flour, baking powder, and salt. Set aside.",
      "In a large bowl, beat the softened butter and sugar with an electric mixer until light and fluffy, about 3 minutes.",
      "Add eggs one at a time, beating well after each addition. Mix in the vanilla extract.",
      "Alternately add the flour mixture and milk to the butter mixture in three additions, beginning and ending with flour. Mix until just combined.",
      "Divide batter evenly among the prepared cups, filling each about 2/3 full.",
      "Bake for 18-22 minutes, or until a toothpick inserted in the center comes out clean.",
      "Let cool in the pan for 5 minutes, then transfer to a wire rack to cool completely.",
      "For the frosting: Beat butter until creamy, then gradually add powdered sugar. Add milk and vanilla, beat on high for 2-3 minutes until fluffy.",
      "Pipe or spread frosting onto cooled cupcakes. Decorate with sprinkles if desired.",
    ],
    tips: [
      "Room temperature ingredients mix more smoothly and create a lighter texture.",
      "Do not overmix the batter once the flour is added - this keeps cupcakes tender.",
      "Use a cookie scoop for even-sized cupcakes.",
    ],
  },
  // ---- End Recipe 1 ----

  // ---- Recipe 2: Chocolate Lava Cake ----
  {
    id: "2",
    title: "Chocolate Lava Cake",
    difficulty: "Medium",
    time: "30 min",
    servings: "4 cakes",
    description: "Rich chocolate cake with a gooey molten center. An impressive dessert that is surprisingly easy to make.",
    category: "Cakes",
    ingredients: [
      "4 oz semi-sweet chocolate, chopped",
      "1/2 cup unsalted butter",
      "1 cup powdered sugar",
      "2 large eggs",
      "2 egg yolks",
      "6 tbsp all-purpose flour",
      "Butter and cocoa powder for greasing ramekins",
      "Vanilla ice cream for serving (optional)",
    ],
    steps: [
      "Preheat oven to 425°F (220°C). Grease 4 ramekins with butter and dust with cocoa powder.",
      "Melt chocolate and butter together in a microwave-safe bowl in 30-second intervals, stirring between each, until smooth.",
      "Stir in the powdered sugar until well combined.",
      "Add the eggs and egg yolks, whisking until smooth.",
      "Fold in the flour gently until just incorporated. Do not overmix.",
      "Divide batter evenly among the prepared ramekins.",
      "Place ramekins on a baking sheet and bake for exactly 12-14 minutes. The edges should be firm but the center will be soft.",
      "Let rest for 1 minute, then run a knife around the edges. Invert each onto a plate.",
      "Serve immediately while the center is still molten. Top with vanilla ice cream or powdered sugar.",
    ],
    tips: [
      "Timing is critical - even 1 extra minute can turn molten centers into solid cake.",
      "You can prepare the batter ahead and refrigerate. Add 2 minutes to bake time if cold.",
      "Use high-quality chocolate for the best flavor.",
    ],
  },
  // ---- End Recipe 2 ----

  // ---- Recipe 3: Sourdough Bread ----
  {
    id: "3",
    title: "Sourdough Bread",
    difficulty: "Hard",
    time: "24 hrs",
    servings: "1 loaf",
    description: "Artisan sourdough bread with a crispy crust and chewy, tangy crumb. A rewarding project for dedicated bakers.",
    category: "Bread",
    ingredients: [
      "500g bread flour",
      "350g water (lukewarm)",
      "100g active sourdough starter",
      "10g sea salt",
      "Rice flour for dusting",
    ],
    steps: [
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
      "Remove from oven and let cool on a wire rack for at least 1 hour before slicing.",
    ],
    tips: [
      "The float test: drop a spoonful of starter in water. If it floats, it is active and ready.",
      "Bulk ferment time varies with temperature. Warmer kitchens need less time.",
      "Do not cut into the bread too early - it is still baking internally as it cools.",
    ],
  },
  // ---- End Recipe 3 ----

  // ---- Recipe 4: Classic Sugar Cookies ----
  {
    id: "4",
    title: "Classic Sugar Cookies",
    difficulty: "Easy",
    time: "2 hrs",
    servings: "24 cookies",
    description: "Buttery, soft sugar cookies perfect for decorating with royal icing. Great for holidays and kids' activities.",
    category: "Cookies",
    ingredients: [
      "3 cups all-purpose flour",
      "1 1/2 tsp baking powder",
      "1/4 tsp salt",
      "1 cup unsalted butter, softened",
      "1 cup granulated sugar",
      "1 large egg",
      "1 tsp vanilla extract",
      "1/2 tsp almond extract (optional)",
    ],
    steps: [
      "Whisk together flour, baking powder, and salt in a bowl. Set aside.",
      "Beat butter and sugar until light and fluffy, about 3 minutes.",
      "Add egg, vanilla, and almond extract. Beat until combined.",
      "Gradually add the flour mixture, mixing on low until a dough forms.",
      "Divide dough in half, flatten into discs, wrap in plastic, and refrigerate for at least 1 hour.",
      "Preheat oven to 350°F (175°C). Line baking sheets with parchment paper.",
      "Roll dough out on a floured surface to 1/4-inch thickness.",
      "Cut into shapes with cookie cutters. Place on prepared sheets 1 inch apart.",
      "Bake for 8-10 minutes. The cookies should be set but not browned.",
      "Cool on the sheet for 5 minutes, then transfer to a wire rack.",
    ],
    tips: [
      "Chill the dough between batches to keep it firm and easy to cut.",
      "For perfectly flat cookies, chill cut-out shapes for 10 minutes before baking.",
      "Decorate with royal icing once completely cooled.",
    ],
  },
  // ---- End Recipe 4 ----

  // ---- Recipe 5: Banana Bread ----
  {
    id: "5",
    title: "Banana Bread",
    difficulty: "Easy",
    time: "1 hr 15 min",
    servings: "1 loaf (10 slices)",
    description: "Moist and tender banana bread with a golden crust. The perfect way to use up overripe bananas.",
    category: "Bread",
    ingredients: [
      "3 large ripe bananas, mashed",
      "1/3 cup melted butter",
      "3/4 cup sugar",
      "1 large egg, beaten",
      "1 tsp vanilla extract",
      "1 tsp baking soda",
      "Pinch of salt",
      "1 1/2 cups all-purpose flour",
      "1/2 cup walnuts, chopped (optional)",
    ],
    steps: [
      "Preheat oven to 350°F (175°C). Grease a 9x5-inch loaf pan.",
      "In a large bowl, mash the bananas with a fork until mostly smooth.",
      "Stir in the melted butter, sugar, egg, and vanilla.",
      "Sprinkle the baking soda and salt over the mixture. Stir to combine.",
      "Add the flour and fold gently until just incorporated. Fold in walnuts if using.",
      "Pour batter into the prepared loaf pan and spread evenly.",
      "Bake for 55-65 minutes, until a toothpick inserted in the center comes out clean.",
      "Let cool in pan for 10 minutes, then turn out onto a wire rack.",
    ],
    tips: [
      "The riper the bananas, the sweeter and more flavorful the bread.",
      "Freeze overripe bananas for future baking. Thaw and use the liquid too.",
      "Add chocolate chips or a swirl of peanut butter for variation.",
    ],
  },
  // ---- End Recipe 5 ----

  // ---- Recipe 6: French Macarons ----
  {
    id: "6",
    title: "French Macarons",
    difficulty: "Hard",
    time: "3 hrs",
    servings: "24 macarons",
    description: "Delicate almond meringue cookies with a smooth top, ruffled feet, and a creamy filling. A true test of baking skill.",
    category: "Cookies",
    ingredients: [
      "1 3/4 cups powdered sugar",
      "1 cup almond flour, finely ground",
      "3 large egg whites, aged overnight at room temp",
      "1/4 cup granulated sugar",
      "1/2 tsp vanilla extract",
      "Gel food coloring (optional)",
      "For filling: 1/2 cup butter, 1 1/2 cups powdered sugar, 2 tbsp cream",
    ],
    steps: [
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
      "Refrigerate assembled macarons for 24 hours before serving for the best texture.",
    ],
    tips: [
      "Age egg whites in the fridge overnight, then bring to room temp before using.",
      "Do not under-fold or over-fold the batter. The figure-eight test helps check consistency.",
      "Humidity is the enemy of macarons. Bake on dry days for best results.",
    ],
  },
  // ---- End Recipe 6 ----

  // ---- Recipe 7: Cinnamon Rolls ----
  {
    id: "7",
    title: "Cinnamon Rolls",
    difficulty: "Medium",
    time: "3 hrs",
    servings: "12 rolls",
    description: "Soft, pillowy cinnamon rolls smothered in cream cheese glaze. Weekend brunch perfection.",
    category: "Bread",
    ingredients: [
      "1 cup warm milk",
      "2 1/4 tsp active dry yeast",
      "1/4 cup granulated sugar",
      "1/3 cup melted butter",
      "1 tsp salt",
      "1 egg",
      "3 1/2 cups all-purpose flour",
      "Filling: 1/3 cup softened butter, 3/4 cup brown sugar, 2 tbsp cinnamon",
      "Glaze: 4 oz cream cheese, 1 cup powdered sugar, 2 tbsp milk, 1 tsp vanilla",
    ],
    steps: [
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
      "Spread glaze generously over warm rolls. Serve immediately.",
    ],
    tips: [
      "Use dental floss to cut rolls cleanly without squishing them.",
      "For overnight rolls, refrigerate after cutting. Let come to room temp for 30 minutes before baking.",
      "Warm the glaze slightly if you want a thinner, drizzly consistency.",
    ],
  },
  // ---- End Recipe 7 ----

  // ---- Recipe 8: Blueberry Muffins ----
  {
    id: "8",
    title: "Blueberry Muffins",
    difficulty: "Easy",
    time: "35 min",
    servings: "12 muffins",
    description: "Bakery-style blueberry muffins with a golden sugar crust. Bursting with fresh blueberries in every bite.",
    category: "Muffins",
    ingredients: [
      "2 cups all-purpose flour",
      "3/4 cup granulated sugar",
      "2 1/2 tsp baking powder",
      "1/2 tsp salt",
      "1/3 cup vegetable oil",
      "1 large egg",
      "1 cup milk",
      "1 1/2 cups fresh blueberries",
      "1 tbsp coarse sugar for topping",
    ],
    steps: [
      "Preheat oven to 400°F (200°C). Line a 12-cup muffin tin with paper liners.",
      "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
      "In a separate bowl, whisk together oil, egg, and milk.",
      "Pour the wet ingredients into the dry ingredients. Stir until just barely combined. Batter should be lumpy.",
      "Gently fold in the blueberries. Toss them in a tablespoon of flour first to prevent sinking.",
      "Divide batter among muffin cups, filling each almost to the top for bakery-style domed muffins.",
      "Sprinkle coarse sugar over the tops.",
      "Bake for 20-25 minutes until golden and a toothpick comes out clean.",
      "Cool in pan for 5 minutes before transferring to a wire rack.",
    ],
    tips: [
      "Do not overmix the batter - lumps are fine and will result in tender muffins.",
      "Frozen blueberries work too. Do not thaw them; fold in while frozen.",
      "Fill an empty muffin cup with water for even heat distribution.",
    ],
  },
  // ---- End Recipe 8 ----

  // ---- Recipe 9: New York Cheesecake ----
  {
    id: "9",
    title: "New York Cheesecake",
    difficulty: "Medium",
    time: "5 hrs (incl. cooling)",
    servings: "12 slices",
    description: "Dense, creamy, and tangy classic New York-style cheesecake with a graham cracker crust.",
    category: "Cakes",
    ingredients: [
      "Crust: 2 cups graham cracker crumbs, 1/4 cup sugar, 6 tbsp melted butter",
      "32 oz (4 blocks) cream cheese, softened",
      "1 cup granulated sugar",
      "1 tbsp vanilla extract",
      "2 tbsp all-purpose flour",
      "1 cup sour cream",
      "4 large eggs",
    ],
    steps: [
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
      "Release from the springform pan. Slice with a hot, dry knife for clean cuts.",
    ],
    tips: [
      "Room temperature cream cheese is essential for a smooth, lump-free batter.",
      "The water bath prevents cracking by providing gentle, even heat.",
      "Overbaking and overmixing are the two most common cheesecake mistakes.",
    ],
  },
  // ---- End Recipe 9 ----

  // ---- Recipe 10: Chocolate Chip Cookies ----
  {
    id: "10",
    title: "Chocolate Chip Cookies",
    difficulty: "Easy",
    time: "45 min",
    servings: "36 cookies",
    description: "Crispy on the edges, chewy in the middle. The ultimate chocolate chip cookie recipe you will make again and again.",
    category: "Cookies",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup (2 sticks) butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups semi-sweet chocolate chips",
    ],
    steps: [
      "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
      "Whisk together flour, baking soda, and salt in a bowl.",
      "In a large bowl, beat butter and both sugars until creamy, about 3 minutes.",
      "Add eggs one at a time, then vanilla. Beat until well combined.",
      "Gradually stir in the flour mixture on low speed until just combined.",
      "Fold in the chocolate chips by hand.",
      "Drop rounded tablespoons of dough onto prepared sheets, 2 inches apart.",
      "Bake for 9-11 minutes until golden brown on the edges but still soft in the center.",
      "Let cool on the baking sheet for 5 minutes, then transfer to a wire rack.",
    ],
    tips: [
      "Chill the dough for 30 minutes for thicker, chewier cookies.",
      "Brown the butter first for a nutty, caramel-like flavor upgrade.",
      "Use a mix of chocolate chips and chopped chocolate for varied texture.",
    ],
  },
  // ---- End Recipe 10 ----
];
// ==================== END RECIPE DATA ====================
