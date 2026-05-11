"""
seed.py
────────
Populates the database with 6 categories, 100 bakery products, and 10 recipes.
Safe to re-run: skips rows whose slug already exists.

Usage:
    python seed.py
"""
import asyncio
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.config import settings
from app.models.product import Category, Product
from app.models.recipe import Recipe

# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_async_engine(settings.DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


# ── Seed data ─────────────────────────────────────────────────────────────────
CATEGORIES = [
    {"name": "Bakeware",         "slug": "bakeware",         "description": "Pans, tins, and trays for every bake."},
    {"name": "Ingredients",      "slug": "ingredients",      "description": "Premium quality baking ingredients."},
    {"name": "Decorating Tools", "slug": "decorating-tools", "description": "Everything for cake decoration."},
    {"name": "Accessories",      "slug": "accessories",      "description": "Aprons, timers, and kitchen essentials."},
    {"name": "Bundles",          "slug": "bundles",          "description": "Curated value packs for bakers."},
    {"name": "Starter Kits",     "slug": "starter-kits",    "description": "Perfect kits for beginners."},
]

# (name, slug, description, price, stock, category_slug, image_url)
PRODUCTS = [
    # ── Bakeware (18) ──────────────────────────────────────────────────────────
    ("Non-Stick Loaf Pan", "non-stick-loaf-pan", "Perfect for sourdough and banana bread.", 12.99, 80, "bakeware", "/src/assets/products/non-stick-loaf-pan.jpg"),
    ("Round Cake Tin 8-inch", "round-cake-tin-8inch", "Classic round tin for layer cakes.", 9.99, 120, "bakeware", "/src/assets/products/round-cake-tin-8inch.jpg"),
    ("Muffin Tray 12-Cup", "muffin-tray-12cup", "Heavy-gauge steel, non-stick coating.", 14.49, 95, "bakeware", "/src/assets/products/muffin-tray-12cup.jpg"),
    ("Square Brownie Pan", "square-brownie-pan", "Even heat distribution for fudgy brownies.", 11.99, 70, "bakeware", "/src/assets/products/square-brownie-pan.jpeg"),
    ("Springform Pan 9-inch", "springform-pan-9inch", "Easy release for cheesecakes and tarts.", 15.99, 60, "bakeware", "/src/assets/products/springform-pan-9inch.jpg"),
    ("Bundt Pan Classic", "bundt-pan-classic", "Intricate pattern for stunning ring cakes.", 18.99, 45, "bakeware", "/src/assets/products/bundt-pan-classic.jpg"),
    ("Sheet Pan Half-Size", "sheet-pan-half-size", "Commercial-grade aluminium baking sheet.", 10.99, 150, "bakeware", "/src/assets/products/sheet-pan-half-size.jpeg"),
    ("Mini Loaf Pan Set x4", "mini-loaf-pan-set", "Four mini loaf tins in one set.", 16.99, 55, "bakeware", "/src/assets/products/mini-loaf-pan-set.jpeg"),
    ("Tart Pan with Removable Base", "tart-pan-removable-base", "11-inch fluted tart tin.", 13.49, 65, "bakeware", None),
    ("Silicone Muffin Mould", "silicone-muffin-mould", "Flexible silicone — no greasing needed.", 8.99, 110, "bakeware", "/src/assets/products/silicone-muffin-mould.jpeg"),
    ("Pizza Stone", "pizza-stone", "Crispy crusts every time.", 24.99, 40, "bakeware", "/src/assets/products/pizza-stone.jpeg"),
    ("Bread Cloche", "bread-cloche", "Steam-trap lid for artisan loaves.", 34.99, 30, "bakeware", None),
    ("Cast Iron Skillet 10-inch", "cast-iron-skillet-10inch", "Pre-seasoned for cornbread and skillets.", 29.99, 35, "bakeware", None),
    ("Pullman Loaf Pan with Lid", "pullman-loaf-pan-lid", "Produces perfectly square sandwich loaves.", 22.99, 50, "bakeware", "/src/assets/products/pullman-loaf-pan-lid.jpeg"),
    ("Ceramic Pie Dish", "ceramic-pie-dish", "Deep dish for generous fruit pies.", 17.49, 55, "bakeware", "/src/assets/products/ceramic-pie-dish.jpeg"),
    ("Angel Food Cake Pan", "angel-food-cake-pan", "Tall centre tube for light sponge cakes.", 14.99, 42, "bakeware", "/src/assets/products/angel-food-cake-pan.jpeg"),
    ("Ramekins Set of 6", "ramekins-set-6", "Oven-safe ramekins for soufflés and crème brûlée.", 19.99, 70, "bakeware", "/src/assets/products/ramekins-set-6.jpeg"),
    ("Madeline Pan", "madeline-pan", "Classic shell-shaped French madeleine mould.", 12.49, 60, "bakeware", "/src/assets/products/madeline-pan.jpeg"),

    # ── Ingredients (18) ──────────────────────────────────────────────────────
    ("Strong White Bread Flour 1kg", "strong-white-bread-flour-1kg", "High-protein flour ideal for yeast breads.", 3.49, 200, "ingredients", "/src/assets/products/strong-white-bread-flour-1kg.jpeg"),
    ("Self-Raising Flour 1.5kg", "self-raising-flour-1-5kg", "Pre-mixed with raising agents.", 3.29, 180, "ingredients", "/src/assets/products/self-raising-flour-1-5kg.jpg"),
    ("Caster Sugar 1kg", "caster-sugar-1kg", "Fine-grain for light sponges and meringues.", 2.49, 220, "ingredients", None),
    ("Dark Muscovado Sugar 500g", "dark-muscovado-sugar-500g", "Rich, molasses-heavy sugar for deep flavour.", 2.99, 160, "ingredients", None),
    ("Unsalted Butter Blocks 250g", "unsalted-butter-250g", "Pure cream butter for baking.", 2.79, 300, "ingredients", None),
    ("Cocoa Powder 250g", "cocoa-powder-250g", "Dutch-processed, intense chocolate flavour.", 3.99, 140, "ingredients", "/src/assets/products/cocoa-powder-250g.jpeg"),
    ("Vanilla Bean Paste 100ml", "vanilla-bean-paste-100ml", "Real vanilla seeds in a convenient paste.", 6.99, 90, "ingredients", "/src/assets/products/vanilla-bean-paste-100ml.jpeg"),
    ("Active Dry Yeast 100g", "active-dry-yeast-100g", "Reliable leavening for breads and rolls.", 3.49, 130, "ingredients", "/src/assets/products/active-dry-yeast-100g.jpeg"),
    ("Baking Powder 200g", "baking-powder-200g", "Aluminium-free, double-acting raising agent.", 2.19, 250, "ingredients", None),
    ("Bicarbonate of Soda 200g", "bicarbonate-of-soda-200g", "Essential for quick breads and cookies.", 1.99, 260, "ingredients", None),
    ("Almond Flour 500g", "almond-flour-500g", "Blanched and finely ground for macarons.", 7.99, 80, "ingredients", "/src/assets/products/almond-flour-500g.jpeg"),
    ("Dark Chocolate Chips 300g", "dark-chocolate-chips-300g", "70% cocoa, perfect for cookies and muffins.", 4.49, 170, "ingredients", "/src/assets/products/dark-chocolate-chips-300g.jpg"),
    ("White Chocolate Chips 300g", "white-chocolate-chips-300g", "Creamy white chocolate for baking.", 4.49, 150, "ingredients", None),
    ("Honey 500g", "honey-500g", "Raw wildflower honey for natural sweetness.", 5.99, 100, "ingredients", None),
    ("Maple Syrup 250ml", "maple-syrup-250ml", "Grade A dark amber syrup.", 6.49, 85, "ingredients", None),
    ("Cream of Tartar 75g", "cream-of-tartar-75g", "Stabilises egg whites and prevents sugar crystallisation.", 2.49, 120, "ingredients", None),
    ("Flaked Almonds 200g", "flaked-almonds-200g", "Toasted for decoration or baked in.", 3.29, 140, "ingredients", None),
    ("Desiccated Coconut 200g", "desiccated-coconut-200g", "Fine-shredded for texture and flavour.", 2.49, 130, "ingredients", None),

    # ── Decorating Tools (18) ─────────────────────────────────────────────────
    ("Offset Spatula 8-inch", "offset-spatula-8inch", "Angled blade for smooth frosting.", 7.99, 110, "decorating-tools", None),
    ("Piping Bag Set 20pcs", "piping-bag-set-20pcs", "Disposable bags with 10 nozzle tips.", 9.99, 130, "decorating-tools", "/src/assets/products/piping-bag-set-20pcs.jpg"),
    ("Turntable Cake Stand", "turntable-cake-stand", "Smooth 360° rotating stand.", 19.99, 60, "decorating-tools", "/src/assets/products/turntable-cake-stand.jpg"),
    ("Bench Scraper Stainless", "bench-scraper-stainless", "Sharp edge for perfectly smooth sides.", 5.99, 90, "decorating-tools", None),
    ("Fondant Smoother", "fondant-smoother", "Dual-sided paddle for flawless fondant.", 6.49, 75, "decorating-tools", "/src/assets/products/fondant-smoother.jpg"),
    ("Cookie Cutter Set 20pcs", "cookie-cutter-set-20pcs", "Stainless steel seasonal shapes.", 12.99, 85, "decorating-tools", "/src/assets/products/cookie-cutter-set-20pcs.jpg"),
    ("Nozzle Tip Set 24pcs", "nozzle-tip-set-24pcs", "Stainless steel piping tips, all shapes.", 14.99, 95, "decorating-tools", None),
    ("Cake Leveller", "cake-leveller", "Adjustable wire to slice even layers.", 8.49, 50, "decorating-tools", None),
    ("Food Colouring Gel Set 12", "food-colouring-gel-set-12", "Vibrant, concentrated gel colours.", 15.99, 80, "decorating-tools", "/src/assets/products/food-colouring-gel-set-12.jpg"),
    ("Edible Gold Dust 5g", "edible-gold-dust-5g", "FDA-approved shimmer for luxury finishes.", 4.99, 60, "decorating-tools", None),
    ("Cake Decorating Comb Set", "cake-decorating-comb-set", "Textured combs for stripe patterns.", 7.99, 55, "decorating-tools", "/src/assets/products/cake-decorating-comb-set.jpeg"),
    ("Palette Knife Straight", "palette-knife-straight", "Flexible steel for spreading and lifting.", 5.49, 100, "decorating-tools", None),
    ("Silicone Mould Roses", "silicone-mould-roses", "Detailed rose cavity mould for fondant.", 6.99, 70, "decorating-tools", "/src/assets/products/silicone-mould-roses.jpeg"),
    ("Stencil Set Geometric", "stencil-set-geometric", "Reusable stencils for dusting patterns.", 8.99, 65, "decorating-tools", None),
    ("Pastry Brush Silicone", "pastry-brush-silicone", "Heat-resistant, easy-clean silicone.", 4.99, 120, "decorating-tools", None),
    ("Cake Drum 10-inch", "cake-drum-10inch", "Thick, sturdy board for tiered cakes.", 3.99, 90, "decorating-tools", None),
    ("Ribbon Crimper Tool", "ribbon-crimper-tool", "Creates crimped patterns in fondant strips.", 5.49, 45, "decorating-tools", None),
    ("Lustre Spray Silver", "lustre-spray-silver", "Metallic sheen in seconds.", 6.99, 50, "decorating-tools", None),

    # ── Accessories (16) ─────────────────────────────────────────────────────
    ("Baker's Apron Canvas", "bakers-apron-canvas", "Cross-back, heavy-duty canvas apron.", 24.99, 70, "accessories", "/src/assets/products/bakers-apron-canvas.jpg"),
    ("Digital Kitchen Scale 5kg", "digital-kitchen-scale-5kg", "0.1g precision, tare function.", 19.99, 80, "accessories", None),
    ("Kitchen Timer Mechanical", "kitchen-timer-mechanical", "60-minute wind-up, no batteries needed.", 8.99, 100, "accessories", None),
    ("Oven Thermometer", "oven-thermometer", "Accurate to ±1°C for consistent bakes.", 7.49, 90, "accessories", None),
    ("Stand Mixer Splash Guard", "stand-mixer-splash-guard", "Fits KitchenAid 5-6qt bowls.", 14.99, 55, "accessories", None),
    ("Silicone Baking Mat Set x2", "silicone-baking-mat-set", "Non-stick, reusable, half-sheet size.", 12.99, 85, "accessories", "/src/assets/products/silicone-baking-mat-set.jpg"),
    ("Dough Scraper Plastic", "dough-scraper-plastic", "Flexible, comfortable grip.", 3.49, 140, "accessories", "/src/assets/products/dough-scraper-plastic.jpeg"),
    ("Rolling Pin French Tapered", "rolling-pin-french-tapered", "Classic tapered hardwood pin.", 11.99, 60, "accessories", "/src/assets/products/rolling-pin-french-tapered.jpg"),
    ("Whisks Set of 3", "whisks-set-of-3", "Balloon, french, and mini whisks.", 13.99, 75, "accessories", "/src/assets/products/whisks-set-of-3.jpg"),
    ("Cooling Rack Set x2", "cooling-rack-set-x2", "Stackable chrome-plated racks.", 11.49, 80, "accessories", "/src/assets/products/cooling-rack-set-x2.jpg"),
    ("Dough Proofer Box", "dough-proofer-box", "Collapsible, maintains humidity for proofing.", 39.99, 25, "accessories", None),
    ("Bench Flour Duster", "bench-flour-duster", "Spring-loaded, even flour distribution.", 9.99, 65, "accessories", None),
    ("Instant-Read Thermometer", "instant-read-thermometer", "3-second read for bread and caramel.", 19.99, 55, "accessories", None),
    ("Pastry Mat Silicone XL", "pastry-mat-silicone-xl", "Non-stick, measurement guides printed on.", 14.49, 70, "accessories", None),
    ("Bread Lame & Cover", "bread-lame-and-cover", "Razor-sharp scoring tool for artisan loaves.", 11.99, 45, "accessories", "/src/assets/products/bread-lame-and-cover.jpeg"),
    ("Cake Box Set 10pcs", "cake-box-set-10pcs", "White kraft boxes, assorted sizes.", 8.99, 100, "accessories", None),

    # ── Bundles (15) ──────────────────────────────────────────────────────────
    ("Bread Baker's Bundle", "bread-bakers-bundle", "Pullman pan, lame, thermometer, and flour.", 49.99, 30, "bundles", "/src/assets/products/bread-bakers-bundle.jpg"),
    ("Cake Decorator Bundle", "cake-decorator-bundle", "Turntable, offset spatula, piping set, and nozzles.", 54.99, 28, "bundles", None),
    ("Weekend Baker Bundle", "weekend-baker-bundle", "Sheet pan, muffin tray, silicone mat, and scale.", 44.99, 35, "bundles", None),
    ("Chocolate Lover Bundle", "chocolate-lover-bundle", "Cocoa, dark chips, white chips, and fondant mould.", 29.99, 40, "bundles", "/src/assets/products/chocolate-lover-bundle.jpg"),
    ("Cookie Baking Bundle", "cookie-baking-bundle", "Cutters, parchment, silicone mat, and spatula.", 34.99, 38, "bundles", "/src/assets/products/cookie-baking-bundle.jpg"),
    ("Sourdough Starter Bundle", "sourdough-starter-bundle", "Cloche, dough scraper, lame, thermometer, and proofer.", 89.99, 20, "bundles", None),
    ("Cupcake Party Bundle", "cupcake-party-bundle", "Muffin tray, piping bags, nozzles, and colours.", 39.99, 32, "bundles", "/src/assets/products/cupcake-party-bundle.jpeg"),
    ("French Patisserie Bundle", "french-patisserie-bundle", "Madeline pan, tart tin, almond flour, and piping set.", 59.99, 22, "bundles", None),
    ("Gluten-Free Baking Bundle", "gluten-free-baking-bundle", "Almond flour, xanthan stand-in, and GF bakeware set.", 49.99, 25, "bundles", None),
    ("Holiday Baking Bundle", "holiday-baking-bundle", "Christmas cookie cutters, gold dust, and lustre spray.", 44.99, 30, "bundles", None),
    ("Pastry Chef Bundle", "pastry-chef-bundle", "Offset spatulas, bench scraper, tart pan, and palette knife.", 52.99, 18, "bundles", None),
    ("Everyday Baking Bundle", "everyday-baking-bundle", "Loaf pan, round tin, scale, and vanilla paste.", 38.99, 42, "bundles", None),
    ("Fondant Artist Bundle", "fondant-artist-bundle", "Smoother, rose mould, gel colours, and crimper.", 47.99, 20, "bundles", None),
    ("Pizza Night Bundle", "pizza-night-bundle", "Pizza stone, peel, and dough scraper set.", 59.99, 22, "bundles", None),
    ("Gift Baker Bundle", "gift-baker-bundle", "Apron, timer, whisk set, and cooling racks in a box.", 69.99, 15, "bundles", None),

    # ── Starter Kits (15) ─────────────────────────────────────────────────────
    ("Complete Beginner Baking Kit", "complete-beginner-baking-kit", "Everything a first-time baker needs.", 79.99, 25, "starter-kits", "/src/assets/products/complete-beginner-baking-kit.jpg"),
    ("Kids Baking Starter Kit", "kids-baking-starter-kit", "Safe, colourful tools sized for little hands.", 34.99, 40, "starter-kits", "/src/assets/products/kids-baking-starter-kit.jpg"),
    ("Bread Baking Starter Kit", "bread-baking-starter-kit", "Loaf pan, yeast, flour, and lame.", 44.99, 30, "starter-kits", None),
    ("Cake Baking Starter Kit", "cake-baking-starter-kit", "Round tin, spatula, piping bag, and caster sugar.", 39.99, 35, "starter-kits", None),
    ("Cookie Baking Starter Kit", "cookie-baking-starter-kit", "Sheet pan, cutters, rolling pin, and flour.", 29.99, 45, "starter-kits", None),
    ("Sourdough Starter Kit", "sourdough-starter-kit", "Cloche, scoring lame, proofing basket, and flour.", 59.99, 20, "starter-kits", "/src/assets/products/sourdough-starter-kit.jpg"),
    ("Cupcake Starter Kit", "cupcake-starter-kit", "Muffin tray, liners, piping set, and frosting spatula.", 34.99, 38, "starter-kits", "/src/assets/products/cupcake-starter-kit.jpg"),
    ("French Pastry Starter Kit", "french-pastry-starter-kit", "Almond flour, piping bags, madeline pan, and vanilla paste.", 49.99, 22, "starter-kits", None),
    ("Healthy Baking Starter Kit", "healthy-baking-starter-kit", "Almond flour, coconut, honey, and loaf pan.", 44.99, 28, "starter-kits", None),
    ("Decoration Starter Kit", "decoration-starter-kit", "Piping bags, nozzles, gel colours, and turntable.", 44.99, 30, "starter-kits", "/src/assets/products/decoration-starter-kit.jpg"),
    ("Gluten-Free Starter Kit", "gluten-free-starter-kit", "GF flour, almond flour, tin, and baking powder.", 49.99, 25, "starter-kits", "/src/assets/products/gluten-free-starter-kit.jpeg"),
    ("Cheesecake Starter Kit", "cheesecake-starter-kit", "Springform pan, ramekins, and vanilla bean paste.", 39.99, 32, "starter-kits", "/src/assets/products/cheesecake-starter-kit.jpeg"),
    ("Vegan Baking Starter Kit", "vegan-baking-starter-kit", "Plant-based essentials: flax, coconut oil, maple syrup.", 44.99, 28, "starter-kits", "/src/assets/products/vegan-baking-starter-kit.jpeg"),
    ("Pizza Starter Kit", "pizza-starter-kit", "Pizza stone, dough scraper, and strong flour.", 49.99, 22, "starter-kits", None),
    ("Gift-Wrapped Starter Kit", "gift-wrapped-starter-kit", "Beautifully boxed beginner kit — perfect present.", 89.99, 15, "starter-kits", None),
]


# ── Helpers ───────────────────────────────────────────────────────────────────
async def get_or_create_category(db: AsyncSession, data: dict) -> Category:
    result = await db.execute(select(Category).where(Category.slug == data["slug"]))
    cat = result.scalars().first()
    if not cat:
        cat = Category(**data)
        db.add(cat)
        await db.flush()
        print(f"  + Created category: {cat.name}")
    else:
        print(f"  ~ Skipped category (exists): {cat.name}")
    return cat


async def get_or_create_product(db: AsyncSession, data: tuple, cat_map: dict) -> None:
    name, slug, desc, price, stock, cat_slug, image_url = data
    result = await db.execute(select(Product).where(Product.slug == slug))
    if result.scalars().first():
        return  # already exists
    product = Product(
        name=name,
        slug=slug,
        description=desc,
        price=Decimal(str(price)),
        stock_quantity=stock,
        image_url=image_url,
        is_available=True,
        category_id=cat_map.get(cat_slug),
    )
    db.add(product)


RECIPES_DATA = [
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


async def get_or_create_recipe(db: AsyncSession, data: dict) -> None:
    result = await db.execute(select(Recipe).where(Recipe.slug == data["slug"]))
    if result.scalars().first():
        return  # already exists

    content = "### Ingredients\n"
    for ingredient in data["ingredients"]:
        content += f"- {ingredient}\n"
    content += "\n### Instructions\n"
    for index, step in enumerate(data["steps"], start=1):
        content += f"{index}. {step}\n"

    recipe = Recipe(
        title=data["title"],
        slug=data["slug"],
        description=data["description"],
        content=content,
        image_url=data["image_url"],
        prep_time=data["time"],
        cook_time="",
        difficulty=data["difficulty"],
        servings=data["servings"],
    )
    db.add(recipe)


async def seed_recipes(db: AsyncSession) -> int:
    existing = (await db.execute(select(Recipe.slug))).scalars().all()
    existing_slugs = set(existing)
    new_count = 0
    for recipe_data in RECIPES_DATA:
        if recipe_data["slug"] in existing_slugs:
            continue
        await get_or_create_recipe(db, recipe_data)
        new_count += 1
    return new_count


# ── Main ──────────────────────────────────────────────────────────────────────
async def main():
    print("[SEED] Seeding database...")
    async with SessionLocal() as db:
        # Categories
        cat_map: dict[str, int] = {}
        for cat_data in CATEGORIES:
            cat = await get_or_create_category(db, cat_data)
            cat_map[cat_data["slug"]] = cat.id
        await db.commit()

        # Products
        existing = (await db.execute(select(Product.slug))).scalars().all()
        existing_slugs = set(existing)
        product_new_count = 0
        for row in PRODUCTS:
            if row[1] not in existing_slugs:
                await get_or_create_product(db, row, cat_map)
                product_new_count += 1
        await db.commit()

        # Recipes
        recipe_new_count = await seed_recipes(db)
        await db.commit()

    print(f"\n[DONE] {product_new_count} new product(s) inserted. "
          f"{len(PRODUCTS) - product_new_count} skipped (already exist).")
    print(f"[DONE] {recipe_new_count} new recipe(s) inserted. "
          f"{len(RECIPES_DATA) - recipe_new_count} skipped (already exist).")


if __name__ == "__main__":
    asyncio.run(main())
