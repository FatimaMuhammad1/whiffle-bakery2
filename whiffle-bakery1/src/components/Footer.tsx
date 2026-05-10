import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Mail, Loader2 } from "lucide-react";
import WhiffleLogo from "@/components/WhiffleLogo";
import { api } from "@/lib/api";
import { toast } from "sonner";

// ---- Footer Component ----
const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await api.subscribeNewsletter(email);
      toast.success(res.message);
      setEmail("");
    } catch {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-chocolate text-cream">
      {/* ... previous content ... */}

      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 rounded-[1.75rem] border border-cream/10 bg-cream/5 px-5 py-5 md:px-7">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 text-cream/90 mb-2">
                <HeartHandshake size={16} strokeWidth={2} />
                <span className="font-body text-xs uppercase tracking-[0.22em]">A warmer kind of baking store</span>
              </div>
              <p className="font-body text-sm opacity-80 max-w-2xl">
                We are here for the real-life version of baking: small victories, flour on the counter, and tools that earn their keep.
              </p>
            </div>
            <Link to="/about" className="font-heading text-cream underline-offset-4 hover:underline">
              Read Our Story
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4 md:text-left">
          {/* ---- Brand Column ---- */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-heading text-4xl font-bold text-cream mb-4 italic tracking-wide">
              Whiffle
            </h3>
            <p className="font-body text-sm opacity-80">
              Your guided baking companion. Quality bakeware, recipes, and everything you need to bake smarter.
            </p>
          </div>
          {/* ---- End Brand Column ---- */}

          {/* ---- Quick Links Column ---- */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 font-body text-sm">
              <Link to="/shop" className="block opacity-80 hover:opacity-100 transition-opacity">Shop</Link>
              <Link to="/blog" className="block opacity-80 hover:opacity-100 transition-opacity">Recipes</Link>
              <Link to="/about" className="block opacity-80 hover:opacity-100 transition-opacity">About Us</Link>
              <Link to="/contact" className="block opacity-80 hover:opacity-100 transition-opacity">Contact</Link>
            </div>
          </div>
          {/* ---- End Quick Links Column ---- */}

          {/* ---- Help Column ---- */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Help</h4>
            <div className="space-y-2 font-body text-sm">
              <Link to="/faq" className="block opacity-80 hover:opacity-100 transition-opacity">FAQ</Link>
              <Link to="/privacy" className="block opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link>
              <Link to="/cart" className="block opacity-80 hover:opacity-100 transition-opacity">My Cart</Link>
              <Link to="/wishlist" className="block opacity-80 hover:opacity-100 transition-opacity">Wishlist</Link>
            </div>
          </div>
          {/* ---- End Help Column ---- */}

          {/* ---- Newsletter Column ---- */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Newsletter</h4>
            <p className="font-body text-sm opacity-80 mb-3">Recipes, quiet kitchen inspiration, and special offers that are actually worth opening.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-foreground bg-cream border-none text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                disabled={loading}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-heading font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <Mail size={14} strokeWidth={2} />}
                <span>Subscribe</span>
              </button>
            </form>
          </div>
          {/* ---- End Newsletter Column ---- */}
        </div>

        {/* ---- Copyright ---- */}
        <div className="mt-8 border-t border-chocolate-light pt-6 text-center font-body text-sm opacity-60 md:text-left">
          &copy; 2026 Whiffle. All rights reserved.
        </div>
        {/* ---- End Copyright ---- */}
      </div>
    </footer>
  );
};
// ---- End Footer Component ----

export default Footer;
// ==================== END FOOTER COMPONENT ====================
