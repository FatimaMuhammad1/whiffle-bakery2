// ==================== PRODUCT DETAIL PAGE ====================
// Shows full product info, image, add to cart, tabs, related products
// =============================================================

import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { api, Review } from "@/lib/api";
import { toFrontendProduct } from "@/lib/productAdapter";
import { useAuth } from "@/context/AuthContext";

// ---- ProductDetail Page Component ----
const ProductDetail = () => {
  const { id } = useParams();
  const localProduct = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [remoteProduct, setRemoteProduct] = useState<typeof localProduct | null>(null);
  const [remoteRelated, setRemoteRelated] = useState<typeof products>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", content: "" });
  const { user } = useAuth();
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) return;

    const loadProduct = async () => {
      try {
        const found = await api.getProductBySlug(id);
        if (cancelled) return;
        const mapped = toFrontendProduct(found);
        setRemoteProduct(mapped);

        if (found.category_id) {
          const relatedRes = await api.getProducts({ categoryId: found.category_id, limit: 12 });
          if (cancelled) return;
          setRemoteRelated(
            relatedRes.items
              .map(toFrontendProduct)
              .filter(p => p.id !== mapped.id)
              .slice(0, 4)
          );
        }
      } catch {
        // Keep local fallback when backend product lookup fails.
      }
    };

    const loadReviews = async () => {
      if (!remoteProduct?.backendId) return;
      setReviewsLoading(true);
      try {
        const data = await api.getReviews(remoteProduct.backendId);
        if (!cancelled) setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    void loadProduct();
    if (remoteProduct?.backendId) {
      void loadReviews();
    }

    return () => {
      cancelled = true;
    };
  }, [id, remoteProduct?.backendId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }
    if (!product?.backendId) return;

    setSubmittingReview(true);
    try {
      const review = await api.submitReview({
        product_id: product.backendId,
        ...newReview
      });
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 5, title: "", content: "" });
      toast.success("Review submitted! Thank you for your feedback.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const product = remoteProduct ?? localProduct;

  // ---- Not Found State ----
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-primary hover:underline font-body">Back to Shop</Link>
      </div>
    );
  }
  // ---- End Not Found State ----

  const wishlisted = isInWishlist(product.id);
  const related =
    remoteRelated.length > 0
      ? remoteRelated
      : products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* ---- Breadcrumb ---- */}
      <div className="container mx-auto px-4 py-4">
        <div className="font-body text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>
      {/* ---- End Breadcrumb ---- */}

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* ---- Product Image Gallery ---- */}
          <div className="flex flex-col gap-4">
            <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
              <img 
                src={mainImage || product.image} 
                alt={product.name} 
                className="w-full aspect-square object-cover" 
                width={512} 
                height={512} 
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition-all bg-card ${
                      (mainImage === img || (!mainImage && idx === 0)) ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* ---- End Product Image Gallery ---- */}

          {/* ---- Product Info ---- */}
          <div>
            <p className="font-body text-sm text-muted-foreground mb-1">{product.brand}</p>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-warm-orange text-warm-orange" : "text-muted"} />
                ))}
              </div>
              <span className="font-body text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-heading text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="font-body text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="font-body text-muted-foreground mb-6">{product.description}</p>

            {/* Difficulty badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-sm text-foreground font-medium">Difficulty:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-heading font-semibold ${product.difficulty === "beginner" ? "bg-green-100 text-green-800" :
                  product.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                }`}>
                {product.difficulty.charAt(0).toUpperCase() + product.difficulty.slice(1)}
              </span>
            </div>

            {/* ---- Quantity Selector ---- */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-secondary rounded-l-lg transition-colors">
                  <Minus size={16} strokeWidth={2} />
                </button>
                <span className="px-4 font-body font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:bg-secondary rounded-r-lg transition-colors">
                  <Plus size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
            {/* ---- End Quantity Selector ---- */}

            {/* ---- Action Buttons ---- */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addToCart(product);
                  toast.success(`${quantity}x ${product.name} added to cart!`);
                }}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} strokeWidth={2} /> Add to Cart
              </button>
              <button
                onClick={() => {
                  if (wishlisted) {
                    removeFromWishlist(product.id);
                    toast.info("Removed from wishlist");
                  } else {
                    addToWishlist(product);
                    toast.success("Added to wishlist!");
                  }
                }}
                className={`px-4 py-3 rounded-xl border font-heading font-semibold transition-colors flex items-center gap-2 ${wishlisted ? "bg-soft-pink border-primary text-primary" : "border-border hover:border-primary text-foreground"
                  }`}
              >
                <Heart size={18} strokeWidth={2} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            {/* ---- End Action Buttons ---- */}
          </div>
          {/* ---- End Product Info ---- */}
        </div>

        {/* ---- Product Tabs (Description / Reviews / Usage) ---- */}
        <div className="mt-12">
          <div className="flex border-b border-border gap-6">
            {["description", "reviews", "usage"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-heading font-semibold capitalize transition-colors border-b-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab === "usage" ? "Usage Guide" : tab}
              </button>
            ))}
          </div>
          <div className="py-6">
            {activeTab === "description" && (
              <p className="font-body text-muted-foreground leading-relaxed">{product.description} Made with premium materials for long-lasting durability. Easy to clean and dishwasher safe. Perfect addition to any kitchen.</p>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* ---- Leave a Review Form ---- */}
                {user && (
                  <div className="bg-secondary/10 rounded-2xl p-6 border border-border">
                    <h3 className="font-heading font-bold text-lg mb-4 text-foreground">Share your experience</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="font-body text-sm font-medium">Rating:</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                              className="text-warm-orange focus:outline-none transition-transform active:scale-125"
                            >
                              <Star size={24} className={star <= newReview.rating ? "fill-warm-orange" : "text-muted"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Review Title (optional)"
                          className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                          value={newReview.title}
                          onChange={e => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <textarea
                          placeholder="Write your thoughts here..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                          value={newReview.content}
                          onChange={e => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-heading font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {submittingReview ? "Submitting..." : "Post Review"}
                      </button>
                    </form>
                  </div>
                )}
                {/* ---- End Leave a Review Form ---- */}

                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground font-body">Loading kitchen feedback...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                            {review.username?.charAt(0) || "A"}
                          </div>
                          <div>
                            <span className="font-heading font-semibold text-sm block">{review.username || "Anonymous Baker"}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} className={i < review.rating ? "fill-warm-orange text-warm-orange" : "text-muted"} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && <h4 className="font-heading font-bold text-foreground mb-1">{review.title}</h4>}
                      <p className="font-body text-sm text-foreground leading-relaxed">{review.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
                    <p className="font-body text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "usage" && (
              <div className="font-body text-muted-foreground space-y-3">
                <p>1. Preheat your oven to the recommended temperature.</p>
                <p>2. Prepare the product according to your recipe.</p>
                <p>3. Use as directed - refer to beginner tips included in the box.</p>
                <p>4. Clean after use with warm soapy water or place in dishwasher.</p>
              </div>
            )}
          </div>
        </div>
        {/* ---- End Product Tabs ---- */}

        {/* ---- Related Products ---- */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
        {/* ---- End Related Products ---- */}
      </div>
    </div>
  );
};
// ---- End ProductDetail Page Component ----

export default ProductDetail;
// ==================== END PRODUCT DETAIL PAGE ====================
