import sys
sys.path.append('d:/project/Bakery-whiffly-FINAL')
import os
import json
from seed import PRODUCTS, CATEGORIES

def main():
    cat_map = {cat["slug"]: cat["name"] for cat in CATEGORIES}

    ts_content = """// ==================== PRODUCT DATA ====================
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
"""

    for i, row in enumerate(PRODUCTS):
        name, slug, desc, price, stock, cat_slug, image_url = row
        backend_id = i + 2  # Database IDs start at 2
        category_name = cat_map.get(cat_slug, "Uncategorized")
        
        # Check if local image exists in public/assets/products
        local_img = None
        for ext in [".jpeg", ".jpg", ".png"]:
            rel_path = f"whiffle-bakery1/public/assets/products/{slug}{ext}"
            abs_path = os.path.join("d:/project/Bakery-whiffly-FINAL", rel_path)
            if os.path.exists(abs_path):
                local_img = f"/assets/products/{slug}{ext}"
                break
                
        # If no exact match, check if there's a file containing all words from the slug
        if not local_img:
            prod_dir = "d:/project/Bakery-whiffly-FINAL/whiffle-bakery1/public/assets/products"
            if os.path.exists(prod_dir):
                slug_words = slug.lower().replace("-", " ").split()
                for f_name in os.listdir(prod_dir):
                    f_name_lower = f_name.lower().replace("-", " ").replace("_", " ")
                    # Check if all words from the slug are present in the filename
                    if all(word in f_name_lower for word in slug_words):
                        local_img = f"/assets/products/{f_name}"
                        break
        
        # If still no match, do the loose match of name words
        if not local_img:
            prod_dir = "d:/project/Bakery-whiffly-FINAL/whiffle-bakery1/public/assets/products"
            if os.path.exists(prod_dir):
                name_words = name.lower().replace("&", " ").replace("-", " ").split()
                # Exclude common small words
                filtered_words = [w for w in name_words if w not in ["and", "with", "of", "set", "x4", "x2", "1kg", "500g", "250g", "200g", "75g", "300g", "150g", "1.5kg", "250ml", "100ml"]]
                if filtered_words:
                    for f_name in os.listdir(prod_dir):
                        f_name_lower = f_name.lower().replace("-", " ").replace("_", " ")
                        if all(word in f_name_lower for word in filtered_words):
                            local_img = f"/assets/products/{f_name}"
                            break

        final_image = image_url or local_img
        
        # Determine some nice mock properties for the frontend
        brand_list = [
            "Whiffle", "BakeRight", "SweetCraft", "ProBake", 
            "KitchenPro", "ArtisanBake", "Baker's Choice", "CakeMaster"
        ]
        brand = brand_list[i % len(brand_list)]
        
        rating = round(4.0 + (i % 11) * 0.1, 1)  # 4.0 to 5.0
        reviews = (i * 7 + 13) % 250
        
        difficulty = "beginner"
        if i % 3 == 1:
            difficulty = "intermediate"
        elif i % 3 == 2:
            difficulty = "pro"
            
        tags = ["essential"]
        if i % 4 == 0:
            tags.append("popular")
        if i % 5 == 0:
            tags.append("recommend")
            
        product_obj = {
            "id": slug,
            "backendId": backend_id,
            "name": name,
            "price": float(price),
            "category": category_name,
            "brand": brand,
            "rating": rating,
            "reviews": reviews,
            "description": desc,
            "difficulty": difficulty,
            "tags": tags,
            "inStock": stock > 0
        }
        
        if final_image:
            product_obj["image"] = final_image
        
        # Serialize the product object into clean formatted TS
        ts_content += f"  {json.dumps(product_obj, indent=2)},\n"

    ts_content += "];\n"

    target_path = "d:/project/Bakery-whiffly-FINAL/whiffle-bakery1/src/data/products.ts"
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
        
    print(f"Successfully generated products.ts with {len(PRODUCTS)} products synced (perfect word matching)!")

if __name__ == "__main__":
    main()
