import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Trash } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={Heart}
          title="A quiet corner."
          description="Your wishlist is waiting for its first spark of inspiration. Save the tools and recipes that speak to your kitchen heart."
          actionText="Discover Artisan Tools"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">My Wishlist</h1>
          <p className="font-body text-muted-foreground mt-2">The kitchen treasures you've set aside.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(product => (
          <div key={product.id} className="group bg-card rounded-[2rem] border border-border p-6 flex gap-6 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            </div>
            <div className="flex flex-col justify-between flex-1 py-1">
              <div>
                <Link to={`/product/${product.id}`} className="font-heading font-bold text-foreground hover:text-primary text-lg leading-tight transition-colors">{product.name}</Link>
                <p className="font-heading font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => { addToCart(product); toast.success("Added to cart!"); }}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-heading font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                  title="Remove from Wishlist"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
