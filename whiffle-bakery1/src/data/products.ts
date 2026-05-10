// ==================== PRODUCT DATA ====================
// Contains all 100 products organized by category with brand info
// ===========================================================

// ---- Product Image Imports ----
import img_angelfoodcakepan from "@/assets/products/angel-food-cake-pan.jpeg";
import img_beginnerbakingkit from "@/assets/products/complete-beginner-baking-kit.jpg";
import img_breadlame from "@/assets/products/bread-lame-and-cover.jpeg";
import img_chocolateloverbundle from "@/assets/products/chocolate-lover-bundle.jpg";
import img_cookiebakingbundle from "@/assets/products/cookie-baking-bundle.jpg";
import img_cookiecutterset20pc from "@/assets/products/cookie-cutter-set-20pcs.jpg";
import img_cupcakestarterkit from "@/assets/products/cupcake-starter-kit.jpg";
import img_doughscraper from "@/assets/products/dough-scraper-plastic.jpeg";
import img_loafpan from "@/assets/products/mini-loaf-pan-set.jpeg";
import img_madelinepan from "@/assets/products/madeline-pan.jpeg";
import img_ovenmittspair from "@/assets/products/oven-mitts.jpg";
import img_pullmanloafpan from "@/assets/products/pullman-loaf-pan-lid.jpeg";
import img_rollingpin from "@/assets/products/rolling-pin-french-tapered.jpg";
import img_siliconebakingmat from "@/assets/products/silicone-baking-mat-set.jpg";
import img_sourdoughstarterkit from "@/assets/products/sourdough-starter-kit.jpg";

// ---- Product Type Definition ----
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

// ==================== PRODUCT CATALOG (100 items) ====================
export const products: Product[] = [
  // ===== BAKEWARE (30) — IDs 1-30 =====
  { id: "1", name: "Round Cake Pan", price: 8.99, category: "Bakeware", brand: "BakeRight", rating: 4.5, reviews: 124, description: "Professional-grade non-stick round cake pan. Perfect for layered cakes and even baking every time.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },
  { id: "2", name: "Muffin & Cupcake Tray", price: 14.99, category: "Bakeware", brand: "BakeRight", rating: 4.7, reviews: 89, description: "12-cup non-stick muffin tray ideal for cupcakes, muffins, and mini quiches.", difficulty: "beginner", tags: ["beginner", "popular"], inStock: true },
  { id: "3", name: "Springform Pan Set", price: 22.99, category: "Bakeware", brand: "ProBake", rating: 4.8, reviews: 67, description: "Set of 3 springform pans for cheesecakes, tortes, and deep-dish desserts.", difficulty: "intermediate", tags: ["pro", "set"], inStock: true },
  { id: "4", name: "Bundt Cake Pan", price: 16.99, originalPrice: 21.99, category: "Bakeware", brand: "BakeRight", rating: 4.4, reviews: 56, description: "Elegant fluted bundt cake pan for stunning ring-shaped cakes.", difficulty: "intermediate", tags: ["decorative"], inStock: true },
  { id: "5", name: "Loaf Pan", price: 9.99, image: img_loafpan, category: "Bakeware", brand: "KitchenPro", rating: 4.3, reviews: 78, description: "Non-stick loaf pan perfect for bread, pound cake, and meatloaf.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },
  { id: "6", name: "Square Cake Pan", price: 10.99, category: "Bakeware", brand: "BakeRight", rating: 4.6, reviews: 95, description: "8-inch square cake pan with non-stick coating for brownies and sheet cakes.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },
  { id: "7", name: "Rectangle Baking Sheet", price: 12.99, category: "Bakeware", brand: "ProBake", rating: 4.5, reviews: 210, description: "Heavy-duty baking sheet for cookies, pastries, and roasting vegetables.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },
  { id: "8", name: "Mini Tart Pan Set", price: 18.99, category: "Bakeware", brand: "ArtisanBake", rating: 4.7, reviews: 43, description: "Set of 6 mini tart pans with removable bottoms for elegant individual desserts.", difficulty: "intermediate", tags: ["decorative", "set"], inStock: true },
  { id: "9", name: "Pie Dish (9-inch)", price: 11.99, category: "Bakeware", brand: "KitchenPro", rating: 4.4, reviews: 134, description: "Classic ceramic pie dish for fruit pies, quiches, and savory bakes.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },
  { id: "10", name: "Angel Food Cake Pan", price: 19.99, image: img_angelfoodcakepan, category: "Bakeware", brand: "ProBake", rating: 4.6, reviews: 52, description: "Tube pan with removable bottom, perfect for angel food and chiffon cakes.", difficulty: "intermediate", tags: ["specialty"], inStock: true },
  { id: "11", name: "Deep Dish Pizza Pan", price: 13.99, category: "Bakeware", brand: "BakeRight", rating: 4.3, reviews: 87, description: "14-inch deep dish pan for Chicago-style pizza and focaccia.", difficulty: "beginner", tags: ["beginner"], inStock: true },
  { id: "12", name: "Fluted Tart Pan", price: 14.99, category: "Bakeware", brand: "ArtisanBake", rating: 4.5, reviews: 62, description: "11-inch fluted tart pan with removable bottom for French-style tarts.", difficulty: "intermediate", tags: ["decorative"], inStock: true },
  { id: "13", name: "Popover Pan", price: 17.99, category: "Bakeware", brand: "ProBake", rating: 4.2, reviews: 38, description: "6-cup popover pan for light, airy popovers and Yorkshire puddings.", difficulty: "intermediate", tags: ["specialty"], inStock: true },
  { id: "14", name: "Madeline Pan", price: 15.99, image: img_madelinepan, category: "Bakeware", brand: "ArtisanBake", rating: 4.8, reviews: 71, description: "12-cavity madeline pan for classic shell-shaped French cookies.", difficulty: "intermediate", tags: ["decorative", "specialty"], inStock: true },
  { id: "15", name: "Cannoli Tubes Set", price: 12.99, category: "Bakeware", brand: "ArtisanBake", rating: 4.4, reviews: 45, description: "Set of 12 stainless steel cannoli tubes for homemade Italian pastries.", difficulty: "pro", tags: ["specialty", "pro"], inStock: true },
  { id: "16", name: "Half Sheet Pan", price: 15.99, category: "Bakeware", brand: "ProBake", rating: 4.7, reviews: 198, description: "Commercial-grade half sheet pan for professional baking results.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },
  { id: "17", name: "Donut Pan", price: 13.99, category: "Bakeware", brand: "BakeRight", rating: 4.5, reviews: 112, description: "6-cavity non-stick donut pan for baked donuts without the fryer.", difficulty: "beginner", tags: ["beginner", "fun"], inStock: true },
  { id: "18", name: "Cake Pop Mold", price: 11.99, category: "Bakeware", brand: "Whiffle", rating: 4.3, reviews: 76, description: "Silicone cake pop mold for making perfectly round cake pops.", difficulty: "beginner", tags: ["fun", "beginner"], inStock: true },
  { id: "19", name: "Bread Banneton Basket", price: 16.99, category: "Bakeware", brand: "ArtisanBake", rating: 4.9, reviews: 145, description: "Natural rattan proofing basket for artisan bread with beautiful spiral pattern.", difficulty: "intermediate", tags: ["artisan"], inStock: true },
  { id: "20", name: "Pullman Loaf Pan", price: 24.99, image: img_pullmanloafpan, category: "Bakeware", brand: "ProBake", rating: 4.6, reviews: 33, description: "13-inch Pullman pan with lid for perfectly square sandwich bread.", difficulty: "pro", tags: ["pro", "artisan"], inStock: true },
  { id: "21", name: "Baguette Pan", price: 14.99, category: "Bakeware", brand: "ArtisanBake", rating: 4.4, reviews: 58, description: "Perforated 3-loaf baguette pan for crispy French bread at home.", difficulty: "intermediate", tags: ["artisan"], inStock: true },
  { id: "22", name: "Scone Pan", price: 16.99, category: "Bakeware", brand: "BakeRight", rating: 4.5, reviews: 42, description: "8-wedge scone pan for perfectly shaped traditional scones.", difficulty: "beginner", tags: ["beginner"], inStock: true },
  { id: "23", name: "Mini Cheesecake Pan", price: 19.99, category: "Bakeware", brand: "ProBake", rating: 4.7, reviews: 89, description: "12-cup mini cheesecake pan with removable bottoms for individual servings.", difficulty: "intermediate", tags: ["specialty", "decorative"], inStock: true },
  { id: "24", name: "Brioche Mold", price: 8.99, category: "Bakeware", brand: "ArtisanBake", rating: 4.3, reviews: 27, description: "Classic fluted brioche mold for traditional French brioche.", difficulty: "pro", tags: ["pro", "specialty"], inStock: true },
  { id: "25", name: "Focaccia Pan", price: 17.99, category: "Bakeware", brand: "KitchenPro", rating: 4.6, reviews: 64, description: "Rectangular deep pan ideal for thick, fluffy focaccia bread.", difficulty: "beginner", tags: ["beginner", "artisan"], inStock: true },
  { id: "26", name: "Silicone Muffin Pan", price: 12.99, category: "Bakeware", brand: "Whiffle", rating: 4.4, reviews: 156, description: "Flexible silicone 12-cup muffin pan - no greasing needed.", difficulty: "beginner", tags: ["beginner", "eco"], inStock: true },
  { id: "27", name: "Ramekin Set (6pc)", price: 19.99, category: "Bakeware", brand: "KitchenPro", rating: 4.8, reviews: 203, description: "Set of 6 ceramic ramekins for creme brulee, souffles, and individual bakes.", difficulty: "beginner", tags: ["essential", "set"], inStock: true },
  { id: "28", name: "Savarin Mold", price: 14.99, category: "Bakeware", brand: "ArtisanBake", rating: 4.2, reviews: 19, description: "Ring-shaped savarin mold for rum babas and gelatin desserts.", difficulty: "pro", tags: ["pro", "specialty"], inStock: true },
  { id: "29", name: "Cake Ring Set", price: 21.99, originalPrice: 27.99, category: "Bakeware", brand: "ProBake", rating: 4.5, reviews: 47, description: "Set of 4 adjustable cake rings for layered mousse cakes and entremets.", difficulty: "pro", tags: ["pro", "set"], inStock: true },
  { id: "30", name: "Non-Stick Cookie Sheet", price: 11.99, category: "Bakeware", brand: "BakeRight", rating: 4.6, reviews: 267, description: "Insulated non-stick cookie sheet prevents burning for perfect cookies.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },

  // ===== INGREDIENTS (20) — IDs 31-50 =====
  { id: "31", name: "All-Purpose Flour (5lb)", price: 6.99, category: "Ingredients", brand: "Baker's Choice", rating: 4.8, reviews: 312, description: "Premium unbleached all-purpose flour for everyday baking.", difficulty: "beginner", tags: ["essential", "staple"], inStock: true },
  { id: "32", name: "Semi-Sweet Chocolate Chips", price: 5.99, category: "Ingredients", brand: "SweetCraft", rating: 4.9, reviews: 445, description: "Rich semi-sweet chocolate chips perfect for cookies, brownies, and melting.", difficulty: "beginner", tags: ["essential", "popular"], inStock: true },
  { id: "33", name: "Pure Vanilla Extract", price: 7.99, category: "Ingredients", brand: "Baker's Choice", rating: 4.8, reviews: 167, description: "Premium pure vanilla extract for authentic flavor in all your baked goods.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "34", name: "Food Coloring Gel Set", price: 12.99, category: "Ingredients", brand: "SweetCraft", rating: 4.7, reviews: 198, description: "12-color gel food coloring set for vibrant icings and batters.", difficulty: "beginner", tags: ["decorating", "fun"], inStock: true },
  { id: "35", name: "Bread Flour (5lb)", price: 7.49, category: "Ingredients", brand: "Baker's Choice", rating: 4.7, reviews: 156, description: "High-protein bread flour for chewy artisan loaves and pizza dough.", difficulty: "intermediate", tags: ["artisan", "staple"], inStock: true },
  { id: "36", name: "Dark Cocoa Powder", price: 8.99, category: "Ingredients", brand: "SweetCraft", rating: 4.8, reviews: 234, description: "Dutch-process dark cocoa powder for rich chocolate flavor.", difficulty: "beginner", tags: ["essential", "chocolate"], inStock: true },
  { id: "37", name: "Active Dry Yeast (3-pack)", price: 4.99, category: "Ingredients", brand: "Baker's Choice", rating: 4.6, reviews: 289, description: "Reliable active dry yeast for bread, rolls, and pizza dough.", difficulty: "beginner", tags: ["essential", "staple"], inStock: true },
  { id: "38", name: "Almond Flour (2lb)", price: 11.99, category: "Ingredients", brand: "Whiffle", rating: 4.7, reviews: 123, description: "Finely ground blanched almond flour for macarons and gluten-free baking.", difficulty: "intermediate", tags: ["specialty", "gluten-free"], inStock: true },
  { id: "39", name: "Powdered Sugar (2lb)", price: 3.99, category: "Ingredients", brand: "Baker's Choice", rating: 4.5, reviews: 178, description: "Ultra-fine powdered sugar for frostings, glazes, and dusting.", difficulty: "beginner", tags: ["essential", "staple"], inStock: true },
  { id: "40", name: "Baking Powder (8oz)", price: 3.49, category: "Ingredients", brand: "Baker's Choice", rating: 4.6, reviews: 201, description: "Double-acting baking powder for fluffy cakes and biscuits.", difficulty: "beginner", tags: ["essential", "staple"], inStock: true },
  { id: "41", name: "Cream of Tartar", price: 4.99, category: "Ingredients", brand: "Baker's Choice", rating: 4.4, reviews: 87, description: "Essential for stabilizing egg whites and making snickerdoodles.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "42", name: "Pumpkin Pie Spice", price: 5.49, category: "Ingredients", brand: "SweetCraft", rating: 4.7, reviews: 156, description: "Warm blend of cinnamon, ginger, nutmeg, and cloves for fall baking.", difficulty: "beginner", tags: ["seasonal", "spice"], inStock: true },
  { id: "43", name: "White Chocolate Chips", price: 6.49, category: "Ingredients", brand: "SweetCraft", rating: 4.5, reviews: 134, description: "Creamy white chocolate chips for cookies, blondies, and candy.", difficulty: "beginner", tags: ["chocolate"], inStock: true },
  { id: "44", name: "Sprinkles Assortment", price: 8.99, category: "Ingredients", brand: "SweetCraft", rating: 4.9, reviews: 378, description: "6-jar sprinkle set with jimmies, nonpareils, and sugar pearls.", difficulty: "beginner", tags: ["decorating", "fun", "popular"], inStock: true },
  { id: "45", name: "Coconut Flour (1lb)", price: 6.99, category: "Ingredients", brand: "Whiffle", rating: 4.3, reviews: 67, description: "Organic coconut flour for grain-free and keto baking.", difficulty: "intermediate", tags: ["specialty", "gluten-free"], inStock: true },
  { id: "46", name: "Fondant (White, 2lb)", price: 14.99, category: "Ingredients", brand: "CakeMaster", rating: 4.6, reviews: 89, description: "Smooth rolled fondant for professional cake covering and decorating.", difficulty: "pro", tags: ["decorating", "pro"], inStock: true },
  { id: "47", name: "Meringue Powder", price: 9.99, category: "Ingredients", brand: "Baker's Choice", rating: 4.7, reviews: 145, description: "Shelf-stable meringue powder for royal icing and Swiss meringue.", difficulty: "intermediate", tags: ["decorating"], inStock: true },
  { id: "48", name: "Cake Flour (4lb)", price: 5.99, category: "Ingredients", brand: "Baker's Choice", rating: 4.8, reviews: 267, description: "Finely milled cake flour for tender, delicate cake crumb.", difficulty: "beginner", tags: ["essential", "staple"], inStock: true },
  { id: "49", name: "Luster Dust Set", price: 11.99, category: "Ingredients", brand: "CakeMaster", rating: 4.5, reviews: 56, description: "6-color edible luster dust set for shimmering cake and cookie decorations.", difficulty: "intermediate", tags: ["decorating", "specialty"], inStock: true },
  { id: "50", name: "Glucose Syrup", price: 7.49, category: "Ingredients", brand: "SweetCraft", rating: 4.4, reviews: 34, description: "Pure glucose syrup for candy making, ganache, and preventing crystallization.", difficulty: "pro", tags: ["pro", "specialty"], inStock: true },

  // ===== DECORATING TOOLS (20) — IDs 51-70 =====
  { id: "51", name: "Cookie Cutter Set (20pc)", price: 12.99, image: img_cookiecutterset20pc, category: "Decorating Tools", brand: "CakeMaster", rating: 4.9, reviews: 312, description: "Set of 20 stainless steel cookie cutters in various fun shapes.", difficulty: "beginner", tags: ["beginner", "fun", "popular"], inStock: true },
  { id: "52", name: "Piping Bag & Tips Set", price: 16.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.8, reviews: 234, description: "Complete piping set with reusable bags, 24 tips, and couplers.", difficulty: "intermediate", tags: ["decorating", "essential"], inStock: true },
  { id: "53", name: "Fondant Tool Kit", price: 14.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.6, reviews: 87, description: "14-piece fondant sculpting tool set for professional cake decorating.", difficulty: "pro", tags: ["pro", "decorating"], inStock: true },
  { id: "54", name: "Decorating Turntable", price: 18.99, category: "Decorating Tools", brand: "Whiffle", rating: 4.7, reviews: 178, description: "Smooth-rotating cake decorating turntable for professional icing results.", difficulty: "intermediate", tags: ["decorating", "popular"], inStock: true },
  { id: "55", name: "Offset Spatula Set", price: 11.99, category: "Decorating Tools", brand: "KitchenPro", rating: 4.8, reviews: 267, description: "Set of 3 offset spatulas for smooth frosting and spreading.", difficulty: "beginner", tags: ["essential", "decorating"], inStock: true },
  { id: "56", name: "Cake Leveler", price: 8.99, category: "Decorating Tools", brand: "ProBake", rating: 4.5, reviews: 134, description: "Adjustable wire cake leveler for perfectly even cake layers.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "57", name: "Bench Scraper Set", price: 9.99, category: "Decorating Tools", brand: "KitchenPro", rating: 4.6, reviews: 156, description: "Set of 3 bench scrapers for smooth sides on buttercream cakes.", difficulty: "beginner", tags: ["essential", "decorating"], inStock: true },
  { id: "58", name: "Cake Stencil Set", price: 13.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.4, reviews: 67, description: "10-piece cake stencil set for beautiful patterns with powdered sugar or cocoa.", difficulty: "beginner", tags: ["decorating", "fun"], inStock: true },
  { id: "59", name: "Letter & Number Stamps", price: 15.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.7, reviews: 98, description: "Alphabet and number fondant stamp set for personalized cake messages.", difficulty: "beginner", tags: ["decorating", "fun"], inStock: true },
  { id: "60", name: "Flower Nail Set", price: 7.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.5, reviews: 56, description: "Set of 4 flower nails for piping buttercream roses and flowers.", difficulty: "pro", tags: ["pro", "decorating"], inStock: true },
  { id: "61", name: "Airbrush Kit", price: 49.99, originalPrice: 64.99, category: "Decorating Tools", brand: "ProBake", rating: 4.6, reviews: 45, description: "Complete cake airbrush kit with compressor and 8 food-safe colors.", difficulty: "pro", tags: ["pro", "decorating"], inStock: true },
  { id: "62", name: "Cake Comb Set", price: 10.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.4, reviews: 89, description: "Set of 4 decorating combs for textured buttercream finishes.", difficulty: "intermediate", tags: ["decorating"], inStock: true },
  { id: "63", name: "Russian Piping Tips (12pc)", price: 14.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.7, reviews: 167, description: "12 Russian piping tips for instant buttercream flowers.", difficulty: "intermediate", tags: ["decorating", "popular"], inStock: true },
  { id: "64", name: "Silicone Mold Set", price: 16.99, category: "Decorating Tools", brand: "Whiffle", rating: 4.5, reviews: 123, description: "Assorted silicone molds for fondant flowers, leaves, and borders.", difficulty: "intermediate", tags: ["decorating"], inStock: true },
  { id: "65", name: "Parchment Piping Triangles", price: 6.99, category: "Decorating Tools", brand: "ProBake", rating: 4.3, reviews: 78, description: "100-count parchment triangles for making custom piping bags.", difficulty: "pro", tags: ["pro"], inStock: true },
  { id: "66", name: "Cake Dowel Kit", price: 8.99, category: "Decorating Tools", brand: "ProBake", rating: 4.6, reviews: 112, description: "Cake support dowels and boards for multi-tier cake construction.", difficulty: "intermediate", tags: ["essential"], inStock: true },
  { id: "67", name: "Edible Ink Markers", price: 9.99, category: "Decorating Tools", brand: "SweetCraft", rating: 4.5, reviews: 145, description: "10-color edible ink marker set for drawing directly on fondant and icing.", difficulty: "beginner", tags: ["fun", "decorating"], inStock: true },
  { id: "68", name: "Impression Mat Set", price: 12.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.4, reviews: 34, description: "4-pattern impression mat set for textured fondant designs.", difficulty: "intermediate", tags: ["decorating"], inStock: true },
  { id: "69", name: "Modeling Tool Set (8pc)", price: 11.99, category: "Decorating Tools", brand: "CakeMaster", rating: 4.6, reviews: 67, description: "8-piece gum paste and fondant modeling tool set.", difficulty: "pro", tags: ["pro", "decorating"], inStock: true },
  { id: "70", name: "Cake Smoother", price: 6.99, category: "Decorating Tools", brand: "Whiffle", rating: 4.7, reviews: 198, description: "Ergonomic cake smoother for flawless fondant and buttercream finishes.", difficulty: "beginner", tags: ["essential", "decorating"], inStock: true },

  // ===== ACCESSORIES (20) — IDs 71-90 =====
  { id: "71", name: "Rolling Pin", price: 11.99, image: img_rollingpin, category: "Accessories", brand: "KitchenPro", rating: 4.5, reviews: 145, description: "Classic wooden rolling pin for dough, pastry, and fondant.", difficulty: "beginner", tags: ["beginner", "essential"], inStock: true },
  { id: "72", name: "Oven Mitts (Pair)", price: 12.99, image: img_ovenmittspair, category: "Accessories", brand: "KitchenPro", rating: 4.6, reviews: 234, description: "Heat-resistant quilted oven mitts for safe handling of hot bakeware.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "73", name: "Cooling Rack (3-Tier)", price: 15.99, category: "Accessories", brand: "ProBake", rating: 4.7, reviews: 178, description: "Stackable 3-tier cooling rack for efficient cooling of multiple batches.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "74", name: "Mixing Bowl Set (5pc)", price: 24.99, category: "Accessories", brand: "KitchenPro", rating: 4.8, reviews: 312, description: "Nesting stainless steel mixing bowl set with non-slip bases.", difficulty: "beginner", tags: ["essential", "set"], inStock: true },
  { id: "75", name: "Measuring Cup Set", price: 9.99, category: "Accessories", brand: "KitchenPro", rating: 4.6, reviews: 267, description: "Stainless steel measuring cups and spoons, dishwasher safe.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "76", name: "Whisk & Spatula Set", price: 13.99, category: "Accessories", brand: "KitchenPro", rating: 4.5, reviews: 189, description: "Stainless steel whisk with silicone spatula for mixing and folding.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "77", name: "Baking Apron", price: 16.99, category: "Accessories", brand: "Whiffle", rating: 4.4, reviews: 123, description: "Cotton canvas baking apron with adjustable neck and pockets.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "78", name: "Silicone Baking Mat", price: 10.99, image: img_siliconebakingmat, category: "Accessories", brand: "Whiffle", rating: 4.6, reviews: 203, description: "Reusable non-stick silicone baking mat. Eco-friendly alternative to parchment.", difficulty: "beginner", tags: ["beginner", "eco"], inStock: true },
  { id: "79", name: "Digital Kitchen Scale", price: 19.99, category: "Accessories", brand: "ProBake", rating: 4.8, reviews: 356, description: "Precision digital scale with tare function for accurate baking measurements.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "80", name: "Kitchen Timer (Digital)", price: 7.99, category: "Accessories", brand: "KitchenPro", rating: 4.5, reviews: 198, description: "Loud digital kitchen timer with magnetic back and easy-read display.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "81", name: "Pastry Brush Set", price: 6.99, category: "Accessories", brand: "KitchenPro", rating: 4.4, reviews: 134, description: "Set of 3 silicone pastry brushes for egg wash, butter, and glazing.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "82", name: "Dough Scraper", price: 5.99, image: img_doughscraper, category: "Accessories", brand: "ProBake", rating: 4.6, reviews: 156, description: "Stainless steel dough scraper with comfortable grip for cutting and portioning.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "83", name: "Oven Thermometer", price: 8.99, category: "Accessories", brand: "ProBake", rating: 4.7, reviews: 245, description: "Accurate oven thermometer to ensure your oven runs at the right temperature.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "84", name: "Parchment Paper Roll", price: 5.99, category: "Accessories", brand: "Baker's Choice", rating: 4.5, reviews: 312, description: "Non-stick parchment paper roll, pre-cut sheets for easy use.", difficulty: "beginner", tags: ["essential", "eco"], inStock: true },
  { id: "85", name: "Cake Carrier", price: 22.99, category: "Accessories", brand: "Whiffle", rating: 4.6, reviews: 87, description: "Round cake carrier with locking lid for safe transport of cakes.", difficulty: "beginner", tags: ["transport"], inStock: true },
  { id: "86", name: "Flour Sifter", price: 9.99, category: "Accessories", brand: "KitchenPro", rating: 4.4, reviews: 134, description: "Hand-crank flour sifter for lump-free flour, cocoa, and powdered sugar.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "87", name: "Pastry Blender", price: 8.99, category: "Accessories", brand: "KitchenPro", rating: 4.3, reviews: 78, description: "Stainless steel pastry blender for cutting butter into flour for pie crusts.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "88", name: "Cookie Scoop Set", price: 11.99, category: "Accessories", brand: "ProBake", rating: 4.7, reviews: 234, description: "Set of 3 spring-loaded cookie scoops in small, medium, and large sizes.", difficulty: "beginner", tags: ["essential", "set"], inStock: true },
  { id: "89", name: "Cake Tester", price: 3.99, category: "Accessories", brand: "KitchenPro", rating: 4.5, reviews: 167, description: "Reusable stainless steel cake tester for checking doneness.", difficulty: "beginner", tags: ["essential"], inStock: true },
  { id: "90", name: "Bread Lame", price: 10.99, image: img_breadlame, category: "Accessories", brand: "ArtisanBake", rating: 4.8, reviews: 98, description: "Scoring lame with 5 replacement blades for artisan bread scoring.", difficulty: "intermediate", tags: ["artisan"], inStock: true },

  // ===== BUNDLES (5) — IDs 91-95 =====
  { id: "91", name: "Pro Decorating Bundle", price: 49.99, originalPrice: 65.99, category: "Bundles", brand: "Whiffle", rating: 4.7, reviews: 89, description: "Complete decorating set with piping bags, tips, spatulas, and turntable.", difficulty: "pro", tags: ["pro", "bundle"], inStock: true },
  { id: "92", name: "Cookie Baking Bundle", price: 34.99, originalPrice: 44.99, image: img_cookiebakingbundle, category: "Bundles", brand: "Whiffle", rating: 4.8, reviews: 156, description: "Everything for cookies: sheets, cutters, scoops, cooling rack, and mat.", difficulty: "beginner", tags: ["beginner", "bundle"], inStock: true },
  { id: "93", name: "Bread Baker Bundle", price: 44.99, originalPrice: 59.99, category: "Bundles", brand: "Whiffle", rating: 4.6, reviews: 67, description: "Artisan bread bundle: banneton, lame, loaf pans, and bread flour.", difficulty: "intermediate", tags: ["artisan", "bundle"], inStock: true },
  { id: "94", name: "Chocolate Lover Bundle", price: 29.99, originalPrice: 39.99, image: img_chocolateloverbundle, category: "Bundles", brand: "Whiffle", rating: 4.9, reviews: 234, description: "Chocolate chips, cocoa powder, melting tools, and molds for chocoholics.", difficulty: "beginner", tags: ["chocolate", "bundle"], inStock: true },
  { id: "95", name: "Cake Boss Bundle", price: 59.99, originalPrice: 79.99, category: "Bundles", brand: "Whiffle", rating: 4.7, reviews: 112, description: "Ultimate cake bundle: pans, turntable, piping set, fondant tools, and more.", difficulty: "pro", tags: ["pro", "bundle"], inStock: true },

  // ===== STARTER KITS (5) — IDs 96-100 =====
  { id: "96", name: "Beginner Baking Kit", price: 39.99, originalPrice: 54.99, image: img_beginnerbakingkit, category: "Starter Kits", brand: "Whiffle", rating: 4.9, reviews: 345, description: "Everything you need to start baking: cake pan, muffin tray, rolling pin, and mixing bowls.", difficulty: "beginner", tags: ["beginner", "kit", "popular"], inStock: true },
  { id: "97", name: "Kids Baking Kit", price: 29.99, originalPrice: 39.99, category: "Starter Kits", brand: "Whiffle", rating: 4.8, reviews: 198, description: "Fun and safe baking kit for kids with cookie cutters, apron, and recipe cards.", difficulty: "beginner", tags: ["beginner", "kit", "fun"], inStock: true },
  { id: "98", name: "Cupcake Starter Kit", price: 34.99, originalPrice: 44.99, image: img_cupcakestarterkit, category: "Starter Kits", brand: "Whiffle", rating: 4.7, reviews: 156, description: "Cupcake essentials: tray, liners, piping bags, tips, and sprinkles.", difficulty: "beginner", tags: ["beginner", "kit"], inStock: true },
  { id: "99", name: "Pie Making Kit", price: 32.99, originalPrice: 42.99, category: "Starter Kits", brand: "Whiffle", rating: 4.6, reviews: 87, description: "Pie starter kit with dish, pastry blender, rolling pin, and pie weights.", difficulty: "beginner", tags: ["beginner", "kit"], inStock: true },
  { id: "100", name: "Sourdough Starter Kit", price: 36.99, originalPrice: 47.99, image: img_sourdoughstarterkit, category: "Starter Kits", brand: "Whiffle", rating: 4.8, reviews: 123, description: "Complete sourdough kit: jar, banneton, lame, thermometer, and guide.", difficulty: "intermediate", tags: ["artisan", "kit"], inStock: true },
];
