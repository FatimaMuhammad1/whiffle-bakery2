"""
seed.py
────────
Populates the database with 6 categories and 100 bakery products.
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
        new_count = 0
        for row in PRODUCTS:
            if row[1] not in existing_slugs:
                await get_or_create_product(db, row, cat_map)
                new_count += 1
        await db.commit()

    print(f"\n[DONE] {new_count} new product(s) inserted. "
          f"{len(PRODUCTS) - new_count} skipped (already exist).")


if __name__ == "__main__":
    asyncio.run(main())
