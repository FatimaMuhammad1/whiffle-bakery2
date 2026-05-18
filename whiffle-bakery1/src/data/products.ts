// ==================== PRODUCT DATA ====================
// Generated automatically from seed.py. DO NOT EDIT BY HAND.
// ===========================================================

export type Product = {
  id: string;
  backendId?: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string; // Optional image
  images?: string[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  description: string;
  difficulty: "beginner" | "intermediate" | "pro";
  tags: string[];
  inStock: boolean;
};

// ---- Category List ----
export const categories = [
  "All",
  "Bakeware",
  "Ingredients",
  "Decorating Tools",
  "Accessories",
  "Bundles",
  "Starter Kits",
];

// ---- Brand List ----
export const brands = [
  "Whiffle",
  "BakeRight",
  "SweetCraft",
  "ProBake",
  "KitchenPro",
  "ArtisanBake",
  "Baker's Choice",
  "CakeMaster",
];

export const products: Product[] = [
  {
  "id": "non-stick-loaf-pan",
  "backendId": 2,
  "name": "Non-Stick Loaf Pan",
  "price": 12.99,
  "image": "/assets/products/non-stick-loaf-pan.jpg",
  "category": "Bakeware",
  "brand": "Whiffle",
  "rating": 4.0,
  "reviews": 13,
  "description": "Perfect for sourdough and banana bread.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "round-cake-tin-8inch",
  "backendId": 3,
  "name": "Round Cake Tin 8-inch",
  "price": 9.99,
  "image": "/assets/products/round-cake-tin-8inch.jpg",
  "category": "Bakeware",
  "brand": "BakeRight",
  "rating": 4.1,
  "reviews": 20,
  "description": "Classic round tin for layer cakes.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "muffin-tray-12cup",
  "backendId": 4,
  "name": "Muffin Tray 12-Cup",
  "price": 14.49,
  "image": "/assets/products/muffin-tray-12cup.jpg",
  "category": "Bakeware",
  "brand": "SweetCraft",
  "rating": 4.2,
  "reviews": 27,
  "description": "Heavy-gauge steel, non-stick coating.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "square-brownie-pan",
  "backendId": 5,
  "name": "Square Brownie Pan",
  "price": 11.99,
  "image": "/assets/products/square-brownie-pan.jpeg",
  "category": "Bakeware",
  "brand": "ProBake",
  "rating": 4.3,
  "reviews": 34,
  "description": "Even heat distribution for fudgy brownies.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "springform-pan-9inch",
  "backendId": 6,
  "name": "Springform Pan 9-inch",
  "price": 15.99,
  "image": "/assets/products/springform-pan-9inch.jpg",
  "category": "Bakeware",
  "brand": "KitchenPro",
  "rating": 4.4,
  "reviews": 41,
  "description": "Easy release for cheesecakes and tarts.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "bundt-pan-classic",
  "backendId": 7,
  "name": "Bundt Pan Classic",
  "price": 18.99,
  "image": "/assets/products/bundt-pan-classic.jpg",
  "category": "Bakeware",
  "brand": "ArtisanBake",
  "rating": 4.5,
  "reviews": 48,
  "description": "Intricate pattern for stunning ring cakes.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "sheet-pan-half-size",
  "backendId": 8,
  "name": "Sheet Pan Half-Size",
  "price": 10.99,
  "image": "/assets/products/sheet-pan-half-size.jpeg",
  "category": "Bakeware",
  "brand": "Baker's Choice",
  "rating": 4.6,
  "reviews": 55,
  "description": "Commercial-grade aluminium baking sheet.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "mini-loaf-pan-set",
  "backendId": 9,
  "name": "Mini Loaf Pan Set x4",
  "price": 16.99,
  "image": "/assets/products/mini-loaf-pan-set.jpeg",
  "category": "Bakeware",
  "brand": "CakeMaster",
  "rating": 4.7,
  "reviews": 62,
  "description": "Four mini loaf tins in one set.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "tart-pan-removable-base",
  "backendId": 10,
  "name": "Tart Pan with Removable Base",
  "price": 13.49,
  "image": "/product/tart-pan-removable-base.jpeg",
  "category": "Bakeware",
  "brand": "Whiffle",
  "rating": 4.8,
  "reviews": 69,
  "description": "11-inch fluted tart tin.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "silicone-muffin-mould",
  "backendId": 11,
  "name": "Silicone Muffin Mould",
  "price": 8.99,
  "image": "/assets/products/silicone-muffin-mould.jpeg",
  "category": "Bakeware",
  "brand": "BakeRight",
  "rating": 4.9,
  "reviews": 76,
  "description": "Flexible silicone \u2014 no greasing needed.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "pizza-stone",
  "backendId": 12,
  "name": "Pizza Stone",
  "price": 24.99,
  "image": "/assets/products/pizza-stone.jpeg",
  "category": "Bakeware",
  "brand": "SweetCraft",
  "rating": 5.0,
  "reviews": 83,
  "description": "Crispy crusts every time.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "bread-cloche",
  "backendId": 13,
  "name": "Bread Cloche",
  "price": 34.99,
  "image": "/product/bread-cloche.jpeg",
  "category": "Bakeware",
  "brand": "ProBake",
  "rating": 4.0,
  "reviews": 90,
  "description": "Steam-trap lid for artisan loaves.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "cast-iron-skillet-10inch",
  "backendId": 14,
  "name": "Cast Iron Skillet 10-inch",
  "price": 29.99,
  "image": "/product/cast-iron-skillet-10inch.jpeg",
  "category": "Bakeware",
  "brand": "KitchenPro",
  "rating": 4.1,
  "reviews": 97,
  "description": "Pre-seasoned for cornbread and skillets.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "pullman-loaf-pan-lid",
  "backendId": 15,
  "name": "Pullman Loaf Pan with Lid",
  "price": 22.99,
  "image": "/assets/products/pullman-loaf-pan-lid.jpeg",
  "category": "Bakeware",
  "brand": "ArtisanBake",
  "rating": 4.2,
  "reviews": 104,
  "description": "Produces perfectly square sandwich loaves.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "ceramic-pie-dish",
  "backendId": 16,
  "name": "Ceramic Pie Dish",
  "price": 17.49,
  "image": "/assets/products/ceramic-pie-dish.jpeg",
  "category": "Bakeware",
  "brand": "Baker's Choice",
  "rating": 4.3,
  "reviews": 111,
  "description": "Deep dish for generous fruit pies.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "angel-food-cake-pan",
  "backendId": 17,
  "name": "Angel Food Cake Pan",
  "price": 14.99,
  "image": "/assets/products/angel-food-cake-pan.jpeg",
  "category": "Bakeware",
  "brand": "CakeMaster",
  "rating": 4.4,
  "reviews": 118,
  "description": "Tall centre tube for light sponge cakes.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "ramekins-set-6",
  "backendId": 18,
  "name": "Ramekins Set of 6",
  "price": 19.99,
  "image": "/assets/products/ramekins-set-6.jpeg",
  "category": "Bakeware",
  "brand": "Whiffle",
  "rating": 4.5,
  "reviews": 125,
  "description": "Oven-safe ramekins for souffl\u00e9s and cr\u00e8me br\u00fbl\u00e9e.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "madeline-pan",
  "backendId": 19,
  "name": "Madeline Pan",
  "price": 12.49,
  "image": "/assets/products/madeline-pan.jpeg",
  "category": "Bakeware",
  "brand": "BakeRight",
  "rating": 4.6,
  "reviews": 132,
  "description": "Classic shell-shaped French madeleine mould.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "strong-white-bread-flour-1kg",
  "backendId": 20,
  "name": "Strong White Bread Flour 1kg",
  "price": 3.49,
  "image": "/assets/products/strong-white-bread-flour-1kg.jpeg",
  "category": "Ingredients",
  "brand": "SweetCraft",
  "rating": 4.7,
  "reviews": 139,
  "description": "High-protein flour ideal for yeast breads.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "self-raising-flour-1-5kg",
  "backendId": 21,
  "name": "Self-Raising Flour 1.5kg",
  "price": 3.29,
  "image": "/assets/products/self-raising-flour-1-5kg.jpg",
  "category": "Ingredients",
  "brand": "ProBake",
  "rating": 4.8,
  "reviews": 146,
  "description": "Pre-mixed with raising agents.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "caster-sugar-1kg",
  "backendId": 22,
  "name": "Caster Sugar 1kg",
  "price": 2.49,
  "image": "/product/caster-sugar-1kg.jpeg",
  "category": "Ingredients",
  "brand": "KitchenPro",
  "rating": 4.9,
  "reviews": 153,
  "description": "Fine-grain for light sponges and meringues.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "dark-muscovado-sugar-500g",
  "backendId": 23,
  "name": "Dark Muscovado Sugar 500g",
  "price": 2.99,
  "image": "/product/dark-muscovado-sugar-500g.jpeg",
  "category": "Ingredients",
  "brand": "ArtisanBake",
  "rating": 5.0,
  "reviews": 160,
  "description": "Rich, molasses-heavy sugar for deep flavour.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "unsalted-butter-250g",
  "backendId": 24,
  "name": "Unsalted Butter Blocks 250g",
  "price": 2.79,
  "image": "/product/unsalted-butter-250g.jpeg",
  "category": "Ingredients",
  "brand": "Baker's Choice",
  "rating": 4.0,
  "reviews": 167,
  "description": "Pure cream butter for baking.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "cocoa-powder-250g",
  "backendId": 25,
  "name": "Cocoa Powder 250g",
  "price": 3.99,
  "image": "/assets/products/cocoa-powder-250g.jpeg",
  "category": "Ingredients",
  "brand": "CakeMaster",
  "rating": 4.1,
  "reviews": 174,
  "description": "Dutch-processed, intense chocolate flavour.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "vanilla-bean-paste-100ml",
  "backendId": 26,
  "name": "Vanilla Bean Paste 100ml",
  "price": 6.99,
  "image": "/assets/products/vanilla-bean-paste-100ml.jpeg",
  "category": "Ingredients",
  "brand": "Whiffle",
  "rating": 4.2,
  "reviews": 181,
  "description": "Real vanilla seeds in a convenient paste.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "active-dry-yeast-100g",
  "backendId": 27,
  "name": "Active Dry Yeast 100g",
  "price": 3.49,
  "image": "/assets/products/active-dry-yeast-100g.jpeg",
  "category": "Ingredients",
  "brand": "BakeRight",
  "rating": 4.3,
  "reviews": 188,
  "description": "Reliable leavening for breads and rolls.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "baking-powder-200g",
  "backendId": 28,
  "name": "Baking Powder 200g",
  "price": 2.19,
  "image": "/product/baking-powder-200g.jpeg",
  "category": "Ingredients",
  "brand": "SweetCraft",
  "rating": 4.4,
  "reviews": 195,
  "description": "Aluminium-free, double-acting raising agent.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "bicarbonate-of-soda-200g",
  "backendId": 29,
  "name": "Bicarbonate of Soda 200g",
  "price": 1.99,
  "image": "/product/bicarbonate-of-soda-200g.jpeg",
  "category": "Ingredients",
  "brand": "ProBake",
  "rating": 4.5,
  "reviews": 202,
  "description": "Essential for quick breads and cookies.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "almond-flour-500g",
  "backendId": 30,
  "name": "Almond Flour 500g",
  "price": 7.99,
  "image": "/assets/products/almond-flour-500g.jpeg",
  "category": "Ingredients",
  "brand": "KitchenPro",
  "rating": 4.6,
  "reviews": 209,
  "description": "Blanched and finely ground for macarons.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "dark-chocolate-chips-300g",
  "backendId": 31,
  "name": "Dark Chocolate Chips 300g",
  "price": 4.49,
  "image": "/assets/products/dark-chocolate-chips-300g.jpg",
  "category": "Ingredients",
  "brand": "ArtisanBake",
  "rating": 4.7,
  "reviews": 216,
  "description": "70% cocoa, perfect for cookies and muffins.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "white-chocolate-chips-300g",
  "backendId": 32,
  "name": "White Chocolate Chips 300g",
  "price": 4.49,
  "image": "/product/white-chocolate-chips-300g.jpeg",
  "category": "Ingredients",
  "brand": "Baker's Choice",
  "rating": 4.8,
  "reviews": 223,
  "description": "Creamy white chocolate for baking.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "honey-500g",
  "backendId": 33,
  "name": "Honey 500g",
  "price": 5.99,
  "image": "/product/honey-500g.jpeg",
  "category": "Ingredients",
  "brand": "CakeMaster",
  "rating": 4.9,
  "reviews": 230,
  "description": "Raw wildflower honey for natural sweetness.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "maple-syrup-250ml",
  "backendId": 34,
  "name": "Maple Syrup 250ml",
  "price": 6.49,
  "image": "/product/maple-syrup-250ml.jpeg",
  "category": "Ingredients",
  "brand": "Whiffle",
  "rating": 5.0,
  "reviews": 237,
  "description": "Grade A dark amber syrup.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "cream-of-tartar-75g",
  "backendId": 35,
  "name": "Cream of Tartar 75g",
  "price": 2.49,
  "image": "/product/cream-of-tartar-75g.jpeg",
  "category": "Ingredients",
  "brand": "BakeRight",
  "rating": 4.0,
  "reviews": 244,
  "description": "Stabilises egg whites and prevents sugar crystallisation.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "flaked-almonds-200g",
  "backendId": 36,
  "name": "Flaked Almonds 200g",
  "price": 3.29,
  "image": "/product/flaked-almonds-200g.jpeg",
  "category": "Ingredients",
  "brand": "SweetCraft",
  "rating": 4.1,
  "reviews": 1,
  "description": "Toasted for decoration or baked in.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "desiccated-coconut-200g",
  "backendId": 37,
  "name": "Desiccated Coconut 200g",
  "price": 2.49,
  "image": "/product/desiccated-coconut-200g.jpeg",
  "category": "Ingredients",
  "brand": "ProBake",
  "rating": 4.2,
  "reviews": 8,
  "description": "Fine-shredded for texture and flavour.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "offset-spatula-8inch",
  "backendId": 38,
  "name": "Offset Spatula 8-inch",
  "price": 7.99,
  "image": "/product/offset-spatula-8inch.jpeg",
  "category": "Decorating Tools",
  "brand": "KitchenPro",
  "rating": 4.3,
  "reviews": 15,
  "description": "Angled blade for smooth frosting.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "piping-bag-set-20pcs",
  "backendId": 39,
  "name": "Piping Bag Set 20pcs",
  "price": 9.99,
  "image": "/assets/products/piping-bag-set-20pcs.jpg",
  "category": "Decorating Tools",
  "brand": "ArtisanBake",
  "rating": 4.4,
  "reviews": 22,
  "description": "Disposable bags with 10 nozzle tips.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "turntable-cake-stand",
  "backendId": 40,
  "name": "Turntable Cake Stand",
  "price": 19.99,
  "image": "/assets/products/turntable-cake-stand.jpg",
  "category": "Decorating Tools",
  "brand": "Baker's Choice",
  "rating": 4.5,
  "reviews": 29,
  "description": "Smooth 360\u00b0 rotating stand.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "bench-scraper-stainless",
  "backendId": 41,
  "name": "Bench Scraper Stainless",
  "price": 5.99,
  "image": "/product/bench-scraper-stainless.jpeg",
  "category": "Decorating Tools",
  "brand": "CakeMaster",
  "rating": 4.6,
  "reviews": 36,
  "description": "Sharp edge for perfectly smooth sides.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "fondant-smoother",
  "backendId": 42,
  "name": "Fondant Smoother",
  "price": 6.49,
  "image": "/assets/products/fondant-smoother.jpg",
  "category": "Decorating Tools",
  "brand": "Whiffle",
  "rating": 4.7,
  "reviews": 43,
  "description": "Dual-sided paddle for flawless fondant.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "cookie-cutter-set-20pcs",
  "backendId": 43,
  "name": "Cookie Cutter Set 20pcs",
  "price": 12.99,
  "image": "/assets/products/cookie-cutter-set-20pcs.jpg",
  "category": "Decorating Tools",
  "brand": "BakeRight",
  "rating": 4.8,
  "reviews": 50,
  "description": "Stainless steel seasonal shapes.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "nozzle-tip-set-24pcs",
  "backendId": 44,
  "name": "Nozzle Tip Set 24pcs",
  "price": 14.99,
  "image": "/product/nozzle-tip-set-24pcs.jpeg",
  "category": "Decorating Tools",
  "brand": "SweetCraft",
  "rating": 4.9,
  "reviews": 57,
  "description": "Stainless steel piping tips, all shapes.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "cake-leveller",
  "backendId": 45,
  "name": "Cake Leveller",
  "price": 8.49,
  "image": "/product/cake-leveller.jpeg",
  "category": "Decorating Tools",
  "brand": "ProBake",
  "rating": 5.0,
  "reviews": 64,
  "description": "Adjustable wire to slice even layers.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "food-colouring-gel-set-12",
  "backendId": 46,
  "name": "Food Colouring Gel Set 12",
  "price": 15.99,
  "image": "/assets/products/food-colouring-gel-set-12.jpg",
  "category": "Decorating Tools",
  "brand": "KitchenPro",
  "rating": 4.0,
  "reviews": 71,
  "description": "Vibrant, concentrated gel colours.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "edible-gold-dust-5g",
  "backendId": 47,
  "name": "Edible Gold Dust 5g",
  "price": 4.99,
  "image": "/product/edible-gold-dust-5g.jpeg",
  "category": "Decorating Tools",
  "brand": "ArtisanBake",
  "rating": 4.1,
  "reviews": 78,
  "description": "FDA-approved shimmer for luxury finishes.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "cake-decorating-comb-set",
  "backendId": 48,
  "name": "Cake Decorating Comb Set",
  "price": 7.99,
  "image": "/assets/products/cake-decorating-comb-set.jpeg",
  "category": "Decorating Tools",
  "brand": "Baker's Choice",
  "rating": 4.2,
  "reviews": 85,
  "description": "Textured combs for stripe patterns.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "palette-knife-straight",
  "backendId": 49,
  "name": "Palette Knife Straight",
  "price": 5.49,
  "image": "/product/palette-knife-straight.jpeg",
  "category": "Decorating Tools",
  "brand": "CakeMaster",
  "rating": 4.3,
  "reviews": 92,
  "description": "Flexible steel for spreading and lifting.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "silicone-mould-roses",
  "backendId": 50,
  "name": "Silicone Mould Roses",
  "price": 6.99,
  "image": "/assets/products/silicone-mould-roses.jpeg",
  "category": "Decorating Tools",
  "brand": "Whiffle",
  "rating": 4.4,
  "reviews": 99,
  "description": "Detailed rose cavity mould for fondant.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "stencil-set-geometric",
  "backendId": 51,
  "name": "Stencil Set Geometric",
  "price": 8.99,
  "image": "/product/stencil-set-geometric.jpeg",
  "category": "Decorating Tools",
  "brand": "BakeRight",
  "rating": 4.5,
  "reviews": 106,
  "description": "Reusable stencils for dusting patterns.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "pastry-brush-silicone",
  "backendId": 52,
  "name": "Pastry Brush Silicone",
  "price": 4.99,
  "image": "/product/pastry-brush-silicone.jpeg",
  "category": "Decorating Tools",
  "brand": "SweetCraft",
  "rating": 4.6,
  "reviews": 113,
  "description": "Heat-resistant, easy-clean silicone.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "cake-drum-10inch",
  "backendId": 53,
  "name": "Cake Drum 10-inch",
  "price": 3.99,
  "image": "/product/cake-drum-10inch.jpeg",
  "category": "Decorating Tools",
  "brand": "ProBake",
  "rating": 4.7,
  "reviews": 120,
  "description": "Thick, sturdy board for tiered cakes.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "ribbon-crimper-tool",
  "backendId": 54,
  "name": "Ribbon Crimper Tool",
  "price": 5.49,
  "image": "/product/ribbon-crimper-tool.jpeg",
  "category": "Decorating Tools",
  "brand": "KitchenPro",
  "rating": 4.8,
  "reviews": 127,
  "description": "Creates crimped patterns in fondant strips.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "lustre-spray-silver",
  "backendId": 55,
  "name": "Lustre Spray Silver",
  "price": 6.99,
  "image": "/product/lustre-spray-silver.jpeg",
  "category": "Decorating Tools",
  "brand": "ArtisanBake",
  "rating": 4.9,
  "reviews": 134,
  "description": "Metallic sheen in seconds.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "bakers-apron-canvas",
  "backendId": 56,
  "name": "Baker's Apron Canvas",
  "price": 24.99,
  "image": "/assets/products/bakers-apron-canvas.jpg",
  "category": "Accessories",
  "brand": "Baker's Choice",
  "rating": 5.0,
  "reviews": 141,
  "description": "Cross-back, heavy-duty canvas apron.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "digital-kitchen-scale-5kg",
  "backendId": 57,
  "name": "Digital Kitchen Scale 5kg",
  "price": 19.99,
  "image": "/product/digital-kitchen-scale-5kg.jpeg",
  "category": "Accessories",
  "brand": "CakeMaster",
  "rating": 4.0,
  "reviews": 148,
  "description": "0.1g precision, tare function.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "kitchen-timer-mechanical",
  "backendId": 58,
  "name": "Kitchen Timer Mechanical",
  "price": 8.99,
  "image": "/product/kitchen-timer-mechanical.jpeg",
  "category": "Accessories",
  "brand": "Whiffle",
  "rating": 4.1,
  "reviews": 155,
  "description": "60-minute wind-up, no batteries needed.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "oven-thermometer",
  "backendId": 59,
  "name": "Oven Thermometer",
  "price": 7.49,
  "image": "/product/oven-thermometer.jpeg",
  "category": "Accessories",
  "brand": "BakeRight",
  "rating": 4.2,
  "reviews": 162,
  "description": "Accurate to \u00b11\u00b0C for consistent bakes.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "stand-mixer-splash-guard",
  "backendId": 60,
  "name": "Stand Mixer Splash Guard",
  "price": 14.99,
  "image": "/product/stand-mixer-splash-guard.jpeg",
  "category": "Accessories",
  "brand": "SweetCraft",
  "rating": 4.3,
  "reviews": 169,
  "description": "Fits KitchenAid 5-6qt bowls.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "silicone-baking-mat-set",
  "backendId": 61,
  "name": "Silicone Baking Mat Set x2",
  "price": 12.99,
  "image": "/src/assets/products/silicone-baking-mat-set.jpg",
  "category": "Accessories",
  "brand": "ProBake",
  "rating": 4.4,
  "reviews": 176,
  "description": "Non-stick, reusable, half-sheet size.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "dough-scraper-plastic",
  "backendId": 62,
  "name": "Dough Scraper Plastic",
  "price": 3.49,
  "image": "/src/assets/products/dough-scraper-plastic.jpeg",
  "category": "Accessories",
  "brand": "KitchenPro",
  "rating": 4.5,
  "reviews": 183,
  "description": "Flexible, comfortable grip.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "rolling-pin-french-tapered",
  "backendId": 63,
  "name": "Rolling Pin French Tapered",
  "price": 11.99,
  "image": "/src/assets/products/rolling-pin-french-tapered.jpg",
  "category": "Accessories",
  "brand": "ArtisanBake",
  "rating": 4.6,
  "reviews": 190,
  "description": "Classic tapered hardwood pin.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "whisks-set-of-3",
  "backendId": 64,
  "name": "Whisks Set of 3",
  "price": 13.99,
  "image": "/src/assets/products/whisks-set-of-3.jpg",
  "category": "Accessories",
  "brand": "Baker's Choice",
  "rating": 4.7,
  "reviews": 197,
  "description": "Balloon, french, and mini whisks.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "cooling-rack-set-x2",
  "backendId": 65,
  "name": "Cooling Rack Set x2",
  "price": 11.49,
  "image": "/src/assets/products/cooling-rack-set-x2.jpg",
  "category": "Accessories",
  "brand": "CakeMaster",
  "rating": 4.8,
  "reviews": 204,
  "description": "Stackable chrome-plated racks.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "dough-proofer-box",
  "backendId": 66,
  "name": "Dough Proofer Box",
  "price": 39.99,
  "image": "/product/dough-proofer-box.jpeg",
  "category": "Accessories",
  "brand": "Whiffle",
  "rating": 4.9,
  "reviews": 211,
  "description": "Collapsible, maintains humidity for proofing.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "bench-flour-duster",
  "backendId": 67,
  "name": "Bench Flour Duster",
  "price": 9.99,
  "image": "/product/bench-flour-duster.jpeg",
  "category": "Accessories",
  "brand": "BakeRight",
  "rating": 5.0,
  "reviews": 218,
  "description": "Spring-loaded, even flour distribution.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "instant-read-thermometer",
  "backendId": 68,
  "name": "Instant-Read Thermometer",
  "price": 19.99,
  "image": "/product/instant-read-thermometer.jpeg",
  "category": "Accessories",
  "brand": "SweetCraft",
  "rating": 4.0,
  "reviews": 225,
  "description": "3-second read for bread and caramel.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "pastry-mat-silicone-xl",
  "backendId": 69,
  "name": "Pastry Mat Silicone XL",
  "price": 14.49,
  "image": "/product/pastry-mat-silicone-xl.jpeg",
  "category": "Accessories",
  "brand": "ProBake",
  "rating": 4.1,
  "reviews": 232,
  "description": "Non-stick, measurement guides printed on.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "bread-lame-and-cover",
  "backendId": 70,
  "name": "Bread Lame & Cover",
  "price": 11.99,
  "image": "/src/assets/products/bread-lame-and-cover.jpeg",
  "category": "Accessories",
  "brand": "KitchenPro",
  "rating": 4.2,
  "reviews": 239,
  "description": "Razor-sharp scoring tool for artisan loaves.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "cake-box-set-10pcs",
  "backendId": 71,
  "name": "Cake Box Set 10pcs",
  "price": 8.99,
  "image": "/product/cake-box-set-10pcs.jpeg",
  "category": "Accessories",
  "brand": "ArtisanBake",
  "rating": 4.3,
  "reviews": 246,
  "description": "White kraft boxes, assorted sizes.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "bread-bakers-bundle",
  "backendId": 72,
  "name": "Bread Baker's Bundle",
  "price": 49.99,
  "image": "/src/assets/products/bread-bakers-bundle.jpg",
  "category": "Bundles",
  "brand": "Baker's Choice",
  "rating": 4.4,
  "reviews": 3,
  "description": "Pullman pan, lame, thermometer, and flour.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "cake-decorator-bundle",
  "backendId": 73,
  "name": "Cake Decorator Bundle",
  "price": 54.99,
  "image": "/product/cake-decorator-bundle.jpeg",
  "category": "Bundles",
  "brand": "CakeMaster",
  "rating": 4.5,
  "reviews": 10,
  "description": "Turntable, offset spatula, piping set, and nozzles.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "weekend-baker-bundle",
  "backendId": 74,
  "name": "Weekend Baker Bundle",
  "price": 44.99,
  "image": "/product/weekend-baker-bundle.jpeg",
  "category": "Bundles",
  "brand": "Whiffle",
  "rating": 4.6,
  "reviews": 17,
  "description": "Sheet pan, muffin tray, silicone mat, and scale.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "chocolate-lover-bundle",
  "backendId": 75,
  "name": "Chocolate Lover Bundle",
  "price": 29.99,
  "image": "/src/assets/products/chocolate-lover-bundle.jpg",
  "category": "Bundles",
  "brand": "BakeRight",
  "rating": 4.7,
  "reviews": 24,
  "description": "Cocoa, dark chips, white chips, and fondant mould.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "cookie-baking-bundle",
  "backendId": 76,
  "name": "Cookie Baking Bundle",
  "price": 34.99,
  "image": "/src/assets/products/cookie-baking-bundle.jpg",
  "category": "Bundles",
  "brand": "SweetCraft",
  "rating": 4.8,
  "reviews": 31,
  "description": "Cutters, parchment, silicone mat, and spatula.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "sourdough-starter-bundle",
  "backendId": 77,
  "name": "Sourdough Starter Bundle",
  "price": 89.99,
  "image": "/product/sourdough-starter-bundle.jpeg",
  "category": "Bundles",
  "brand": "ProBake",
  "rating": 4.9,
  "reviews": 38,
  "description": "Cloche, dough scraper, lame, thermometer, and proofer.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "cupcake-party-bundle",
  "backendId": 78,
  "name": "Cupcake Party Bundle",
  "price": 39.99,
  "image": "/src/assets/products/cupcake-party-bundle.jpeg",
  "category": "Bundles",
  "brand": "KitchenPro",
  "rating": 5.0,
  "reviews": 45,
  "description": "Muffin tray, piping bags, nozzles, and colours.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "french-patisserie-bundle",
  "backendId": 79,
  "name": "French Patisserie Bundle",
  "price": 59.99,
  "image": "/product/french-patisserie-bundle.jpeg",
  "category": "Bundles",
  "brand": "ArtisanBake",
  "rating": 4.0,
  "reviews": 52,
  "description": "Madeline pan, tart tin, almond flour, and piping set.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "gluten-free-baking-bundle",
  "backendId": 80,
  "name": "Gluten-Free Baking Bundle",
  "price": 49.99,
  "image": "/product/gluten-free-baking-bundle.jpeg",
  "category": "Bundles",
  "brand": "Baker's Choice",
  "rating": 4.1,
  "reviews": 59,
  "description": "Almond flour, xanthan stand-in, and GF bakeware set.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "holiday-baking-bundle",
  "backendId": 81,
  "name": "Holiday Baking Bundle",
  "price": 44.99,
  "image": "/product/holiday-baking-bundle.jpeg",
  "category": "Bundles",
  "brand": "CakeMaster",
  "rating": 4.2,
  "reviews": 66,
  "description": "Christmas cookie cutters, gold dust, and lustre spray.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "pastry-chef-bundle",
  "backendId": 82,
  "name": "Pastry Chef Bundle",
  "price": 52.99,
  "image": "/product/pastry-chef-bundle.jpeg",
  "category": "Bundles",
  "brand": "Whiffle",
  "rating": 4.3,
  "reviews": 73,
  "description": "Offset spatulas, bench scraper, tart pan, and palette knife.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "everyday-baking-bundle",
  "backendId": 83,
  "name": "Everyday Baking Bundle",
  "price": 38.99,
  "image": "/product/everyday-baking-bundle.jpeg",
  "category": "Bundles",
  "brand": "BakeRight",
  "rating": 4.4,
  "reviews": 80,
  "description": "Loaf pan, round tin, scale, and vanilla paste.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "fondant-artist-bundle",
  "backendId": 84,
  "name": "Fondant Artist Bundle",
  "price": 47.99,
  "image": "/product/fondant-artist-bundle.jpeg",
  "category": "Bundles",
  "brand": "SweetCraft",
  "rating": 4.5,
  "reviews": 87,
  "description": "Smoother, rose mould, gel colours, and crimper.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "pizza-night-bundle",
  "backendId": 85,
  "name": "Pizza Night Bundle",
  "price": 59.99,
  "image": "/product/pizza-night-bundle.jpeg",
  "category": "Bundles",
  "brand": "ProBake",
  "rating": 4.6,
  "reviews": 94,
  "description": "Pizza stone, peel, and dough scraper set.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "gift-baker-bundle",
  "backendId": 86,
  "name": "Gift Baker Bundle",
  "price": 69.99,
  "image": "/product/gift-baker-bundle.jpeg",
  "category": "Bundles",
  "brand": "KitchenPro",
  "rating": 4.7,
  "reviews": 101,
  "description": "Apron, timer, whisk set, and cooling racks in a box.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "complete-beginner-baking-kit",
  "backendId": 87,
  "name": "Complete Beginner Baking Kit",
  "price": 79.99,
  "image": "/src/assets/products/complete-beginner-baking-kit.jpg",
  "category": "Starter Kits",
  "brand": "ArtisanBake",
  "rating": 4.8,
  "reviews": 108,
  "description": "Everything a first-time baker needs.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "kids-baking-starter-kit",
  "backendId": 88,
  "name": "Kids Baking Starter Kit",
  "price": 34.99,
  "image": "/src/assets/products/kids-baking-starter-kit.jpg",
  "category": "Starter Kits",
  "brand": "Baker's Choice",
  "rating": 4.9,
  "reviews": 115,
  "description": "Safe, colourful tools sized for little hands.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "bread-baking-starter-kit",
  "backendId": 89,
  "name": "Bread Baking Starter Kit",
  "price": 44.99,
  "image": "/product/bread-baking-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "CakeMaster",
  "rating": 5.0,
  "reviews": 122,
  "description": "Loaf pan, yeast, flour, and lame.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "cake-baking-starter-kit",
  "backendId": 90,
  "name": "Cake Baking Starter Kit",
  "price": 39.99,
  "image": "/product/cake-baking-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "Whiffle",
  "rating": 4.0,
  "reviews": 129,
  "description": "Round tin, spatula, piping bag, and caster sugar.",
  "difficulty": "intermediate",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "cookie-baking-starter-kit",
  "backendId": 91,
  "name": "Cookie Baking Starter Kit",
  "price": 29.99,
  "image": "/product/cookie-baking-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "BakeRight",
  "rating": 4.1,
  "reviews": 136,
  "description": "Sheet pan, cutters, rolling pin, and flour.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "sourdough-starter-kit",
  "backendId": 92,
  "name": "Sourdough Starter Kit",
  "price": 59.99,
  "image": "/src/assets/products/sourdough-starter-kit.jpg",
  "category": "Starter Kits",
  "brand": "SweetCraft",
  "rating": 4.2,
  "reviews": 143,
  "description": "Cloche, scoring lame, proofing basket, and flour.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "cupcake-starter-kit",
  "backendId": 93,
  "name": "Cupcake Starter Kit",
  "price": 34.99,
  "image": "/src/assets/products/cupcake-starter-kit.jpg",
  "category": "Starter Kits",
  "brand": "ProBake",
  "rating": 4.3,
  "reviews": 150,
  "description": "Muffin tray, liners, piping set, and frosting spatula.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "french-pastry-starter-kit",
  "backendId": 94,
  "name": "French Pastry Starter Kit",
  "price": 49.99,
  "image": "/product/french-pastry-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "KitchenPro",
  "rating": 4.4,
  "reviews": 157,
  "description": "Almond flour, piping bags, madeline pan, and vanilla paste.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "healthy-baking-starter-kit",
  "backendId": 95,
  "name": "Healthy Baking Starter Kit",
  "price": 44.99,
  "image": "/product/healthy-baking-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "ArtisanBake",
  "rating": 4.5,
  "reviews": 164,
  "description": "Almond flour, coconut, honey, and loaf pan.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "decoration-starter-kit",
  "backendId": 96,
  "name": "Decoration Starter Kit",
  "price": 44.99,
  "image": "/src/assets/products/decoration-starter-kit.jpg",
  "category": "Starter Kits",
  "brand": "Baker's Choice",
  "rating": 4.6,
  "reviews": 171,
  "description": "Piping bags, nozzles, gel colours, and turntable.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "gluten-free-starter-kit",
  "backendId": 97,
  "name": "Gluten-Free Starter Kit",
  "price": 49.99,
  "image": "/src/assets/products/gluten-free-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "CakeMaster",
  "rating": 4.7,
  "reviews": 178,
  "description": "GF flour, almond flour, tin, and baking powder.",
  "difficulty": "pro",
  "tags": [
    "essential",
    "recommend"
  ],
  "inStock": true
},
  {
  "id": "cheesecake-starter-kit",
  "backendId": 98,
  "name": "Cheesecake Starter Kit",
  "price": 39.99,
  "image": "/src/assets/products/cheesecake-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "Whiffle",
  "rating": 4.8,
  "reviews": 185,
  "description": "Springform pan, ramekins, and vanilla bean paste.",
  "difficulty": "beginner",
  "tags": [
    "essential",
    "popular"
  ],
  "inStock": true
},
  {
  "id": "vegan-baking-starter-kit",
  "backendId": 99,
  "name": "Vegan Baking Starter Kit",
  "price": 44.99,
  "image": "/src/assets/products/vegan-baking-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "BakeRight",
  "rating": 4.9,
  "reviews": 192,
  "description": "Plant-based essentials: flax, coconut oil, maple syrup.",
  "difficulty": "intermediate",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "pizza-starter-kit",
  "backendId": 100,
  "name": "Pizza Starter Kit",
  "price": 49.99,
  "image": "/product/pizza-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "SweetCraft",
  "rating": 5.0,
  "reviews": 199,
  "description": "Pizza stone, dough scraper, and strong flour.",
  "difficulty": "pro",
  "tags": [
    "essential"
  ],
  "inStock": true
},
  {
  "id": "gift-wrapped-starter-kit",
  "backendId": 101,
  "name": "Gift-Wrapped Starter Kit",
  "price": 89.99,
  "image": "/product/gift-wrapped-starter-kit.jpeg",
  "category": "Starter Kits",
  "brand": "ProBake",
  "rating": 4.0,
  "reviews": 206,
  "description": "Beautifully boxed beginner kit \u2014 perfect present.",
  "difficulty": "beginner",
  "tags": [
    "essential"
  ],
  "inStock": true
},
];
