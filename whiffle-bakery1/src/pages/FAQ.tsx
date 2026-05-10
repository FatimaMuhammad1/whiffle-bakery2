// ==================== FAQ PAGE ====================
// Accordion-style frequently asked questions
// ==============================================

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, HelpCircle, Package, Sparkles, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

// ---- FAQ Data ----
const faqCategories = [
  {
    title: "Orders & Shipping",
    icon: Package,
    items: [
      { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders over $35. Orders under $35 have a flat shipping rate of $5.99." },
      { q: "Can I return products?", a: "Yes, we offer a 30-day return policy on all unused products in their original packaging. Contact our support team to initiate a return." },
      { q: "How long does delivery take?", a: "Most orders are processed within 24 hours and delivered within 3-5 business days across the continental US." },
    ]
  },
  {
    title: "The Whiffle Kitchen",
    icon: ChefHat,
    items: [
      { q: "What is Whiffle?", a: "Whiffle is a guided baking platform that helps you find the right tools and teaches you how to use them. We're your partner in every bake." },
      { q: "What are Starter Kits?", a: "Starter Kits are curated bundles of essential tools. Each kit includes everything you need to master a specific skill, like Sourdough or Pastry." },
      { q: "How do difficulty levels work?", a: "We tag every product as Beginner, Intermediate, or Pro to help you choose tools that match your current skill and help you grow." },
    ]
  },
  {
    title: "Recipes & Support",
    icon: MessageCircleQuestion,
    items: [
      { q: "Do you have recipes?", a: "Absolutely! Check out our Recipes section for step-by-step guides. We have everything from simple cookies to complex macarons." },
      { q: "How can I contact support?", a: "You can reach us via email at hello@whiffle.com, call us at +1 (555) 123-4567, or use our Contact page form." },
    ]
  }
];

// ---- FAQ Item Component (Smooth Accordion) ----
const FAQItem = ({ q, a, isOpen, onClick }: { q: string, a: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className={cn(
      "group rounded-2xl border transition-all duration-300 overflow-hidden",
      isOpen 
        ? "bg-card border-primary shadow-lg shadow-primary/5" 
        : "bg-card/50 border-border hover:border-primary/30"
    )}>
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className={cn(
          "font-heading font-bold text-lg md:text-xl transition-colors",
          isOpen ? "text-primary" : "text-foreground group-hover:text-primary/80"
        )}>
          {q}
        </span>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
          isOpen ? "bg-primary text-cream rotate-180" : "bg-secondary text-muted-foreground"
        )}>
          <ChevronDown size={18} />
        </div>
      </button>
      
      <div className={cn(
        "grid transition-all duration-500 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 font-body text-muted-foreground text-lg leading-relaxed max-w-2xl">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- FAQ Page Component ----
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/30 rounded-full -ml-64 -mb-64 blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-24 max-w-4xl">
        {/* ---- Page Header ---- */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <HelpCircle size={18} className="text-primary" />
            <span className="font-heading text-sm font-bold text-primary uppercase tracking-widest">Help Center</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Curious <span className="italic text-primary">Minds</span> Bake Better.
          </h1>
          <p className="font-body text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Whiffle, our artisan tools, and your journey in the kitchen.
          </p>
        </div>

        {/* ---- FAQ Content ---- */}
        <div className="space-y-16">
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both" style={{ animationDelay: `${catIdx * 150}ms` }}>
              <div className="flex items-center gap-3 mb-8 ml-2">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <category.icon size={24} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {category.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {category.items.map((faq, itemIdx) => (
                  <FAQItem 
                    key={itemIdx}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openIndex === `${catIdx}-${itemIdx}`}
                    onClick={() => toggle(catIdx, itemIdx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ---- Still Have Questions? ---- */}
        <div className="mt-32 text-center bg-chocolate text-cream rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <Sparkles className="text-primary mx-auto mb-6" size={48} />
            <h2 className="font-heading text-4xl font-bold mb-6 italic">Still have a kitchen riddle?</h2>
            <p className="font-body text-cream/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              If you couldn't find your answer here, our team of baking enthusiasts is ready to help you out.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-3 bg-primary text-cream px-10 py-4 rounded-2xl font-heading font-bold text-xl hover:bg-primary/90 transition-all hover:translate-y-1 shadow-xl shadow-primary/20"
            >
              Reach out to us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
