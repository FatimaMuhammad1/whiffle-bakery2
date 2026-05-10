import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { BadgeCheck, Package, MapPin, Sparkles, ChevronRight, ShoppingBag } from "lucide-react";
import IconBadge from "@/components/IconBadge";
import { api, type BackendOrder } from "@/lib/api";
import { format } from "date-fns";

const OrderSuccess = () => {
  const { state } = useLocation();
  const orderId = (state as { orderId?: string } | null)?.orderId;
  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (orderId) {
      api.getOrder(orderId)
        .then(setOrder)
        .catch(err => console.error("Failed to fetch order details:", err))
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-body text-muted-foreground animate-pulse">Retrieving your order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-20 pt-10">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <IconBadge 
            icon={BadgeCheck} 
            size="lg" 
            className="mx-auto mb-6 h-24 w-24 bg-emerald-100 text-emerald-600 ring-emerald-200" 
            iconClassName="h-12 w-12" 
          />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-chocolate dark:text-cream mb-3">Order Confirmed!</h1>
          <p className="font-body text-lg text-muted-foreground max-w-md mx-auto">
            Your baking supplies are officially on their way. We've sent a confirmation email to your inbox.
          </p>
        </div>

        {order ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            {/* Order Card */}
            <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-xl flourish-border">
              <div className="bg-chocolate p-8 text-cream flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-cream/40 mb-1">Confirmation Number</p>
                  <h2 className="text-xl font-mono font-bold">#{order.id.toUpperCase()}</h2>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-cream/40 mb-1">Order Date</p>
                  <p className="font-body font-bold">{format(new Date(order.created_at), 'MMMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="p-8 space-y-10">
                {/* Items Summary */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-xl text-chocolate dark:text-cream flex items-center gap-2">
                    <Package size={20} className="text-primary" /> Your Basket Items
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-4 border-b border-border/50 last:border-0">
                        <div className="flex-1">
                          <p className="font-body font-bold text-chocolate dark:text-cream">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p>
                        </div>
                        <p className="font-heading font-bold text-lg text-chocolate dark:text-cream">${Number(item.subtotal).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                  <div className="space-y-3">
                    <h3 className="font-heading font-bold text-sm text-chocolate dark:text-cream flex items-center gap-2 uppercase tracking-widest">
                      <MapPin size={16} className="text-primary" /> Shipping To
                    </h3>
                    <div className="bg-secondary/20 p-5 rounded-2xl text-sm font-body text-muted-foreground space-y-1">
                      <p className="font-bold text-chocolate dark:text-cream">{order.shipping_address?.full_name}</p>
                      <p>{order.shipping_address?.address}</p>
                      <p>{order.shipping_address?.city}, {order.shipping_address?.zip}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-right flex flex-col justify-end">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${Number(order.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Shipping</span>
                        <span>{Number(order.shipping_amount) === 0 ? "FREE" : `$${Number(order.shipping_amount).toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-border mt-2">
                        <span className="font-heading font-bold text-xl text-chocolate dark:text-cream">Total Paid</span>
                        <span className="font-heading font-bold text-3xl text-primary">${Number(order.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps / CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/profile" 
                className="group bg-card border border-border p-6 rounded-3xl flex items-center justify-between hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-heading font-bold text-chocolate dark:text-cream">Track Order</p>
                    <p className="text-xs text-muted-foreground font-body">Check delivery status</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                to="/shop" 
                className="group bg-card border border-border p-6 rounded-3xl flex items-center justify-between hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Sparkles size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-heading font-bold text-chocolate dark:text-cream">Keep Browsing</p>
                    <p className="text-xs text-muted-foreground font-body">New arrivals this week</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-[3rem] shadow-sm flourish-border animate-fade-in">
             <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/30">
               <Package size={40} />
             </div>
             <p className="font-body text-muted-foreground mb-8 italic">Order summary is loading. You can also view it in your profile.</p>
             <Link to="/" className="bg-primary text-white px-8 py-3.5 rounded-2xl font-heading font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20">
               Return Home
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
