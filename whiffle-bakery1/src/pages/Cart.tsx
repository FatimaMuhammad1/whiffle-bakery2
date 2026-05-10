// ==================== CART PAGE ====================
// Shopping cart with item list, quantity controls, and order summary
// ==================================================

import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, Trash, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import EmptyState from "@/components/EmptyState";

// ---- Cart Page Component ----
const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  // ---- Empty Cart State ----
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your basket is resting."
          description="It's currently empty, but it's dreaming of fresh flour, golden butter, and new kitchen adventures."
          actionText="Explore the Shop"
          actionLink="/shop"
          secondaryText="Free shipping on orders over $35!"
        />
      </div>
    );
  }
  // ---- End Empty Cart State ----

  const shipping = totalPrice > 35 ? 0 : 5.99;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Shopping Cart</h1>
          <p className="font-body text-muted-foreground mt-2">You have {items.length} item{items.length !== 1 ? 's' : ''} in your basket.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ---- Cart Items List ---- */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.product.id} className="group bg-card rounded-[2rem] border border-border p-6 flex gap-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-2xl">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${item.product.id}`} className="font-heading font-bold text-foreground hover:text-primary text-xl leading-tight transition-colors">{item.product.name}</Link>
                    <p className="font-body text-muted-foreground text-sm mt-1">{item.product.category}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all" title="Remove item">
                    <Trash size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity controls */}
                  <div className="flex items-center bg-secondary/50 rounded-xl p-1 border border-border">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-card rounded-lg transition-colors"
                    >
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span className="px-4 font-heading font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-card rounded-lg transition-colors"
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>
                  <span className="font-heading font-bold text-2xl text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6 flex items-center gap-6 text-muted-foreground text-sm font-body">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-primary" />
              <span>{shipping === 0 ? "Free Shipping" : "Standard Shipping"}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
        {/* ---- End Cart Items List ---- */}

        {/* ---- Order Summary ---- */}
        <div className="lg:col-span-1">
          <div className="bg-chocolate text-cream rounded-[2.5rem] p-8 md:p-10 sticky top-24 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />

            <h2 className="font-heading text-2xl font-bold mb-8">Order Summary</h2>

            <div className="space-y-4 font-body">
              <div className="flex justify-between text-cream/70">
                <span>Subtotal</span>
                <span className="font-bold text-cream">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>Shipping</span>
                <span className="font-bold text-cream">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="pt-6 mt-6 border-t border-cream/10 flex justify-between items-end">
                <div>
                  <p className="text-sm text-cream/50 uppercase tracking-widest font-bold">Total Amount</p>
                  <p className="text-4xl font-heading font-bold text-primary mt-1">${(totalPrice + shipping).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* ---- Checkout Button ---- */}
            <Link
              to="/checkout"
              className="mt-10 block w-full bg-primary text-primary-foreground text-center px-8 py-5 rounded-2xl font-heading font-bold text-xl hover:bg-primary/90 transition-all hover:translate-y-1 shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              Checkout Now
              <ArrowRight size={22} />
            </Link>

            {shipping > 0 && (
              <p className="text-xs text-center text-cream/40 mt-6 italic">
                Add ${(35 - totalPrice).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
        </div>
        {/* ---- End Order Summary ---- */}
      </div>
    </div>
  );
};

export default Cart;
// ==================== END CART PAGE ====================
