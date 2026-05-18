import { ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  loadStripe,
  StripeElementsOptions
} from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe("pk_test_51S299F2IaCSBeMIfiEK0PMLGCCmWN3Hs4kRK5qKtLa5IEi5TmrPWvWKoYHl8Tc0wtk6Twc3FntDDzD8BvCqO4iG90046DLDLOq");


// ---- Stripe Checkout Form Sub-component ----
const CheckoutForm = ({ amount, formData }: { amount: number; formData: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { items } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // 1. Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // 2. Map items for backend
        const orderItems = items.map(item => {
          // If product came from API, it has backendId (int). 
          // If it came from mock data, id is a string but might be an int-string.
          const realId = item.product.backendId || Number(item.product.id);
          return {
            product_id: realId,
            quantity: item.quantity
          };
        });

        // 3. Finalize order on the backend
        const payload = {
          items: orderItems,
          shipping_address: {
            full_name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
          },
          notes: "Placed via Stripe Checkout",
          captcha_token: "bypass-v3",
          payment_intent_id: paymentIntent.id
        };

        console.log("Finalizing order with payload:", payload);
        const order = await api.checkout(payload);

        clearCart();
        toast.success("Payment successful! Your order is being prepared.");
        navigate("/order-success", { state: { orderId: order.id } });
      }
    } catch (err) {
      console.error("Checkout finalization error:", err);
      toast.error("Order finalization failed, but payment was received. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6 flourish-border">
        <h3 className="font-heading font-bold text-xl text-chocolate dark:text-cream mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">2</span>
          Payment Details
        </h3>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <button
        disabled={!stripe || isProcessing}
        className="w-full bg-primary text-white py-4 rounded-2xl font-heading font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
      >
        {isProcessing ? "Processing Payment..." : `Pay $${amount.toFixed(2)} Now`}
      </button>

      <p className="text-[10px] text-center text-muted-foreground font-body uppercase tracking-widest">
        Secure checkout powered by Stripe
      </p>
    </form>
  );
};

// ---- Main Checkout Page Component ----
const Checkout = () => {
  const { items, totalPrice } = useCart();
  const { isAuthenticated, loading, user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    zip: user?.zip || ""
  });

  // Update form data if user loads later
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        zip: user.zip || ""
      });
    }
  }, [user]);

  const shipping = totalPrice > 35 ? 0 : 5.99;
  const finalTotal = totalPrice + shipping;

  // Initialize Payment Intent on mount or total change
  useEffect(() => {
    if (items.length > 0 && isAuthenticated) {
      const amountInCents = Math.round(finalTotal * 100);
      api.createPaymentIntent(amountInCents)
        .then(res => setClientSecret(res.client_secret))
        .catch(err => {
          console.error("Payment initialization error:", err);
          toast.error(`Payment initialization failed: ${err instanceof Error ? err.message : String(err)}. Check your backend configuration.`);
        });
    }
  }, [items, finalTotal, isAuthenticated]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-4xl font-bold text-chocolate dark:text-cream mb-4">Your basket is empty</h1>
        <Link to="/shop" className="text-primary hover:underline font-body font-bold">Return to the Bakery</Link>
      </div>
    );
  }

  if (!loading && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-4xl font-bold text-chocolate dark:text-cream mb-4">Sign in to checkout</h1>
        <Link to="/login" className="text-primary hover:underline font-body font-bold">Go to Login</Link>
      </div>
    );
  }

  const appearance: StripeElementsOptions["appearance"] = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#8B4513', // Chocolate
      colorBackground: '#ffffff',
      colorText: '#333333',
      borderRadius: '12px',
    }
  };

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance,
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-chocolate dark:text-cream">Finalize Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ---- Left Side: Form & Payment ---- */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Info */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 flourish-border shadow-sm">
              <h3 className="font-heading font-bold text-xl text-chocolate dark:text-cream mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">1</span>
                Shipping Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Fatima..." },
                  { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
                  { label: "Address", key: "address", type: "text", placeholder: "Street address...", full: true },
                  { label: "City", key: "city", type: "text", placeholder: "City..." },
                  { label: "ZIP Code", key: "zip", type: "text", placeholder: "00000" },
                ].map(f => (
                  <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                    <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      required
                      value={(formData as any)[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stripe Elements */}
            {clientSecret ? (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm amount={finalTotal} formData={formData} />
              </Elements>
            ) : (
              <div className="h-64 bg-card border border-border rounded-[2.5rem] flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-body text-sm text-muted-foreground font-semibold">Initializing secure checkout...</p>
              </div>
            )}
          </div>

          {/* ---- Right Side: Order Summary ---- */}
          <div className="lg:col-span-5">
            <div className="bg-chocolate text-cream rounded-[3rem] p-10 shadow-2xl sticky top-24 overflow-hidden border border-chocolate-light">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

              <div className="relative z-10">
                <h2 className="font-heading font-bold text-2xl mb-8 border-b border-cream/10 pb-4">Order Summary</h2>

                <div className="space-y-6 mb-10 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between gap-4 items-start">
                      <div className="flex-1">
                        <p className="font-heading font-bold text-lg text-cream leading-tight">{item.product.name}</p>
                        <p className="text-xs font-body text-cream/50 mt-1 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-heading font-bold text-lg text-primary-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-cream/10 pt-6 font-body text-sm font-semibold">
                  <div className="flex justify-between text-cream/70">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-cream/20 mt-4">
                    <span className="font-heading font-bold text-2xl">Total</span>
                    <span className="font-heading font-bold text-3xl text-primary-foreground">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
