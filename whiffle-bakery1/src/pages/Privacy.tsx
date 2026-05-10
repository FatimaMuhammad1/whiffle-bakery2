// ==================== PRIVACY POLICY PAGE ====================
// Static privacy policy content with editorial styling
// =============================================================

import { ShieldCheck, Eye, Database, UserCheck, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// ---- Privacy Page Component ----
const Privacy = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -mr-80 -mt-80 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full -ml-80 -mb-80 blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-24 max-w-4xl">
        {/* ---- Breadcrumb ---- */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary font-body font-bold text-sm mb-12 hover:underline group">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* ---- Page Header ---- */}
        <div className="mb-20 text-center md:text-left">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Privacy <span className="italic text-primary">Matters</span>.
          </h1>
          <p className="font-body text-muted-foreground text-xl max-w-2xl leading-relaxed">
            We believe your data should be handled with the same care and transparency as our artisan recipes. 
            Last updated: <span className="text-foreground font-semibold">May 2026</span>
          </p>
        </div>

        {/* ---- Main Content Area ---- */}
        <div className="space-y-12">
          
          {/* Section 1: Introduction */}
          <section className="bg-card rounded-[2.5rem] border border-border p-10 md:p-14 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Eye size={32} />
                </div>
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Our Commitment</h2>
                <div className="font-body text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    At Whiffle, we value the trust you place in us when you share your information. This policy outlines how we collect, use, and most importantly, protect your personal information in our digital kitchen.
                  </p>
                  <p>
                    We never sell, rent, or trade your personal data to third parties for marketing purposes. Your trust is our most valuable ingredient.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-secondary/30 rounded-[2.5rem] p-10 border border-primary/5">
              <Database className="text-primary mb-6" size={32} />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                We collect information you provide directly to us: name, email address, shipping details, and payment information when you place an order or join our mailing list.
              </p>
            </div>
            
            <div className="bg-secondary/30 rounded-[2.5rem] p-10 border border-primary/5">
              <ShieldCheck className="text-primary mb-6" size={32} />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Data Security</h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Your data is protected by industry-standard SSL encryption and stored on secure servers. We conduct regular audits to ensure your details remain safe and private.
              </p>
            </div>
          </div>

          {/* Section 3: Your Rights */}
          <section className="bg-chocolate text-cream rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-cream/10 flex items-center justify-center text-primary">
                  <UserCheck size={32} />
                </div>
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold mb-6">Your Rights & Choices</h2>
                <p className="font-body text-cream/70 text-lg leading-relaxed mb-8">
                  You are in full control of your data. You have the right to access, update, or delete your personal information at any time. If you wish to opt-out of our kitchen notes (newsletter), you can do so with a single click.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:hello@whiffle.com" className="inline-flex items-center gap-2 bg-primary text-cream px-6 py-3 rounded-xl font-heading font-bold hover:bg-primary/90 transition-all">
                    <Mail size={18} /> Contact Privacy Team
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Final Note */}
          <div className="text-center pt-12">
            <p className="font-body text-muted-foreground italic">
              Questions about our privacy practices? We're here to help. Reach out at <span className="text-primary font-bold">hello@whiffle.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
// ==================== END PRIVACY POLICY PAGE ====================
