import type { Product } from "@/data/products";
import type { BackendProduct } from "@/lib/api";

// Converts backend ProductRead payloads into the existing frontend product shape.
// This keeps UI components unchanged while we progressively move data to the API.
export function toFrontendProduct(product: BackendProduct): Product {
  return {
    id: product.slug,
    backendId: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image_url ?? undefined,
    images: product.images,
    category: product.category?.name ?? "Uncategorized",
    brand: "Whiffle",
    rating: 4.5,
    reviews: 0,
    description: product.description ?? "",
    difficulty: "beginner",
    tags: [],
    inStock: product.is_available && product.stock_quantity > 0,
  };
}
