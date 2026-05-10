// ==================== HOME PAGE ====================
// Landing page with hero, categories, featured products,
// banners, trust badges, and newsletter
// ===================================================

import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, NotebookPen, PackageOpen, Sparkles, Wheat, Gift, Mail, HeartHandshake, Clock3 } from "lucide-react";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import IconBadge from "@/components/IconBadge";
import heroBg from "@/assets/hero-bakery.jpg";
import starterKitsBg from "@/assets/starter-kits-banner.jpg";
import featuredDealBg from "@/assets/featured-deal.jpg";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toFrontendProduct } from "@/lib/productAdapter";

// ---- Category Icons Data ----
const categoryIcons = [
  { name: "Bakeware", icon: PackageOpen, slug: "Bakeware" },
  { name: "Ingredients", icon: Wheat, slug: "Ingredients" },
  { name: "Decorating", icon: Sparkles, slug: "Decorating Tools" },
  { name: "Bundles", icon: Gift, slug: "Bundles" },
];
// ---- End Category Icons Data ----

// ---- Index Page Component ----
const Index = () => {
  const [remoteFeatured, setRemoteFeatured] = useState<Product[]>([]);
  const localFeatured = products.filter(p => p.reviews > 150).slice(0, 8);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.getProducts({ limit: 12 });
        // Pick products that have many reviews or just top 8
        const mapped = res.items.map(toFrontendProduct);
        setRemoteFeatured(mapped.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      }
    };
    loadFeatured();
  }, []);

  const featured = remoteFeatured.length > 0 ? remoteFeatured : localFeatured;

  return (
    <div className="min-h-screen">
      {/* ---- Hero Section ---- */}
      <section className="relative h-[560px] overflow-hidden flourish-border">
        <img src={heroBg} alt="Fresh baked goods" className="w-full h-full object-cover" width={1920} height={640} />
        <div className="absolute inset-0 bg-gradient-to-r from-chocolate/80 to-chocolate/30 flex items-center">
          <div className="container mx-auto px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2 mb-5 text-cream/90">
              <Sparkles size={14} strokeWidth={2} />
              <span className="font-body text-xs uppercase tracking-[0.22em]">Curated for home bakers</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-cream mb-4 max-w-xl">
              Bake Smarter<br />with Whiffle
            </h1>
            <p className="font-body text-cream/80 text-lg mb-6 max-w-md">
              Thoughtful tools, approachable recipes, and gentle guidance for the kind of baking that makes a kitchen feel lived in.
            </p>
            <div className="flex gap-3">
              <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity">
                Shop Now
              </Link>
              <Link to="/blog" className="bg-cream text-chocolate px-6 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity">
                Explore Recipes
              </Link>
            </div>
            <div className="mt-10 flex flex-col gap-3 text-cream/75 sm:flex-row sm:gap-8">
              <div className="inline-flex items-center gap-2 font-body text-sm">
                <HeartHandshake size={16} strokeWidth={2} />
                Handpicked with beginner-friendly guidance
              </div>
              <div className="inline-flex items-center gap-2 font-body text-sm">
                <Clock3 size={16} strokeWidth={2} />
                Fast wins for weekday bakers and slow Sunday projects
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ---- End Hero Section ---- */}

      {/* ---- Shop by Category (Compact) ---- */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <span className="eyebrow">Start Here</span>
          <h2 className="font-heading text-2xl font-bold text-foreground mt-3">Shop by Category</h2>
          <p className="font-body text-muted-foreground mt-2 max-w-2xl mx-auto">
            A softer way to browse: begin with the kind of baking you want to do, not a wall of products.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {categoryIcons.map(cat => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.slug}`}
              className="bg-card rounded-xl p-5 text-center hover:shadow-lg transition-all duration-300 border border-border group hover:-translate-y-1"
            >
              <IconBadge icon={cat.icon} size="md" className="mx-auto mb-2" />
              <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      {/* ---- End Shop by Category ---- */}

      {/* ---- Featured Products ---- */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Handpicked Favorites</span>
              <h2 className="font-heading text-3xl font-bold text-foreground mt-3">Featured Products</h2>
              <p className="font-body text-muted-foreground mt-2 max-w-2xl">
                The pieces customers come back for again and again, from everyday pans to the little extras that make baking feel easier.
              </p>
            </div>
            <Link to="/shop" className="font-body text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      {/* ---- End Featured Products ---- */}

      {/* ---- Starter Kits Banner ---- */}
      <section className="relative h-[350px] overflow-hidden">
        <img src={starterKitsBg} alt="Starter Kits" className="w-full h-full object-cover" loading="lazy" width={1920} height={512} />
        <div className="absolute inset-0 bg-gradient-to-r from-chocolate/70 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2 mb-4 text-cream/90">
              <Gift size={14} strokeWidth={2} />
              <span className="font-body text-xs uppercase tracking-[0.22em]">No-guesswork kits</span>
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-2">Perfect for Beginners</h2>
            <p className="font-body text-cream/80 mb-6 max-w-md">Get everything you need in one box, with combinations picked to feel like a reassuring first bake rather than a risky shopping cart.</p>
            <Link to="/shop?category=Starter Kits" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity">
              Shop Starter Kits
            </Link>
          </div>
        </div>
      </section>
      {/* ---- End Starter Kits Banner ---- */}

      {/* ---- Kitchen Note ---- */}
      <section className="container mx-auto px-4 py-14">
        <div className="warm-grain rounded-[2rem] border border-border px-6 py-8 md:px-10 md:py-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="eyebrow">From Our Kitchen</span>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground mt-4 mb-4">Whiffle is built for the in-between moments.</h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed max-w-2xl">
                <p>Not every bake is a celebration cake. Sometimes it is a quiet tray of muffins before school, a late-night cookie batch, or the first loaf that finally rises the way you hoped.</p>
                <p>That is why we pair practical tools with gentle guidance and recipes that feel encouraging instead of intimidating.</p>
              </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-[1.75rem] border border-border p-6 md:p-8 shadow-sm">
              <p className="font-heading text-2xl text-foreground mb-3">A note from the Whiffle team</p>
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                We obsess over the small things: grip, cleanup, confidence, and whether a product actually earns a permanent spot in your cupboard.
              </p>
              <p className="font-body text-sm uppercase tracking-[0.18em] text-primary/75">Chosen by bakers who actually bake at home</p>
            </div>
          </div>
        </div>
      </section>
      {/* ---- End Kitchen Note ---- */}

      {/* ---- Why Choose Us ---- */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <span className="eyebrow">Why It Feels Different</span>
          <h2 className="font-heading text-3xl font-bold text-foreground mt-3">Why Choose Whiffle?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: NotebookPen, title: "Beginner Friendly", desc: "Guided shopping with difficulty levels and usage tips for every product." },
            { icon: BadgeCheck, title: "Quality Guaranteed", desc: "We curate only the best bakeware and ingredients from trusted brands." },
            { icon: PackageOpen, title: "Fast Delivery", desc: "Free shipping on orders over $35. Get baking within days, not weeks." },
          ].map(item => (
            <div key={item.title} className="bg-card rounded-xl p-8 text-center border border-border hover:shadow-md transition-shadow">
              <IconBadge icon={item.icon} size="lg" className="mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">{item.title}</h3>
              <p className="font-body text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ---- End Why Choose Us ---- */}

      {/* ---- Featured Deal Banner ---- */}
      <section className="relative h-[300px] overflow-hidden flourish-border">
        <img src={featuredDealBg} alt="Featured Deal" className="w-full h-full object-cover" loading="lazy" width={1920} height={512} />
        <div className="absolute inset-0 bg-chocolate/60 flex items-center justify-center text-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2 mb-4 text-cream/90">
              <Sparkles size={14} strokeWidth={2} />
              <span className="font-body text-xs uppercase tracking-[0.22em]">This week in the pantry</span>
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-2">Featured Deal</h2>
            <p className="font-body text-cream/90 text-lg mb-6">A practical favorite for busy kitchens: 25% off bakeware sets for a limited time.</p>
            <Link to="/shop" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      {/* ---- End Featured Deal Banner ---- */}

      {/* ---- Newsletter Section ---- */}
      <section className="bg-gradient-to-r from-secondary to-soft-pink/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Mail size={16} strokeWidth={2} className="text-primary" />
            <span className="font-heading text-sm font-semibold text-primary">Stay Updated</span>
          </div>
          <h2 className="font-heading text-[2.35rem] md:text-[3rem] font-bold text-foreground mb-3 leading-[1.05]">Join Our Mailing List</h2>
          <p className="font-body text-muted-foreground mb-6 mx-auto max-w-xl text-base md:text-lg">Seasonal bakes, kitchen notes, and genuinely useful offers from our shelves to yours.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      {/* ---- End Newsletter Section ---- */}
    </div>
  );
};
// ---- End Index Page Component ----

export default Index;
// ==================== END HOME PAGE ====================
