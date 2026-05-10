// ==================== PRODUCT CARD COMPONENT ====================
// Reusable card for displaying a product in grids
// Shows image, name, brand, price, sale badge, and add-to-cart button
// ================================================================

import { ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ---- Props Type ----
type ProductCardProps = {
  product: Product;
  className?: string;
};
// ---- End Props Type ----

// ---- ProductCard Component ----
const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();

  // ---- Add to Cart Handler ----
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };
  // ---- End Add to Cart Handler ----

  return (
    <Link to={`/product/${product.id}`} className={cn("group block", className)}>
      <div className="bg-card rounded-[2rem] overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        {/* ---- Product Image ---- */}
        <div className="relative aspect-square overflow-hidden bg-secondary/20 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-primary/20 transition-colors group-hover:text-primary/40 p-12">
              <ShoppingBag size={64} strokeWidth={1} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                Image Coming Soon
              </span>
            </div>
          )}

          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-primary text-cream text-[10px] font-bold px-4 py-1.5 rounded-full font-heading shadow-lg uppercase tracking-widest z-10">
              Special Offer
            </div>
          )}

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/5 transition-colors duration-500" />
        </div>
        {/* ---- End Product Image ---- */}

        {/* ---- Product Info ---- */}
        <div className="p-6 text-center">
          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-heading font-bold text-foreground text-lg mb-2 truncate group-hover:text-primary transition-colors">{product.name}</h3>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-heading font-bold text-xl text-primary">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through decoration-primary/30">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* ---- Add to Cart Button ---- */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-xs font-heading font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-95"
          >
            <ShoppingBag size={14} strokeWidth={2.5} />
            Add to Cart
          </button>
          {/* ---- End Add to Cart Button ---- */}
        </div>
        {/* ---- End Product Info ---- */}
      </div>
    </Link>
  );
};
// ---- End ProductCard Component ----

export default ProductCard;
// ==================== END PRODUCT CARD COMPONENT ====================
