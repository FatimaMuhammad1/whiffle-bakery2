// ==================== CONTACT PAGE ====================
// Contact form, info cards, and FAQ link
// =====================================================

import { useState } from "react";
import { toast } from "sonner";
import { MailOpen, MapPinned, PhoneCall, SendHorizonal, MessageSquare, Clock, ArrowRight, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bakery.jpg";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

// ---- Contact Page Component ----
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Form Submit Handler ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.sendContact(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Hero Section: Immersive & Artistic ---- */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroBg} 
            alt="Contact Whiffle" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-chocolate/60 backdrop-blur-[1px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2 mb-6 text-cream/90 backdrop-blur-sm font-body text-xs uppercase tracking-[0.3em]">
              Get in Touch
            </span>
            <h1 className="font-heading text-6xl md:text-8xl font-bold text-cream mb-6 italic drop-shadow-2xl">
              Let's <span className="text-primary not-italic">Talk</span> Baking
            </h1>
            <p className="font-body text-cream/80 text-xl max-w-xl mx-auto leading-relaxed font-light">
              Have a question about a tool, a recipe, or just want to share your latest bake? We're all ears.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Main Contact Area ---- */}
      <div className="container mx-auto px-4 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch translate-y-8">
          
          {/* ---- Left Side: Contact Info & Atmosphere ---- */}
          <div className="lg:col-span-5 flex">
            <div className="w-full bg-chocolate text-cream rounded-[2.5rem] border border-transparent p-10 md:p-14 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
              
              <div className="mb-10">
                <h2 className="font-heading text-4xl font-bold mb-4 flex items-center gap-3">
                  <Sparkles className="text-primary" size={32} />
                  Connect with Us
                </h2>
                <p className="font-body text-cream/70 text-lg">We're here to help you translate your baking vision into reality.</p>
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: MailOpen, title: "Email Our Kitchen", detail: "hello@whiffle.com", sub: "Response time: < 24 hours" },
                  { icon: PhoneCall, title: "Give Us a Ring", detail: "+1 (555) 123-4567", sub: "Mon-Fri, 9am - 5pm EST" },
                  { icon: MapPinned, title: "Our New York Studio", detail: "123 Baker Street, NY 10001", sub: "Open for workshop pickups" },
                  { icon: Clock, title: "Customer Care", detail: "Monday - Saturday", sub: "We're here when you're baking." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group/item">
                    <div className="w-12 h-12 rounded-2xl bg-cream/10 flex items-center justify-center shrink-0 border border-cream/10 group-hover/item:bg-primary group-hover/item:text-cream transition-all duration-300">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-1">{item.title}</h3>
                      <p className="font-body text-cream/90">{item.detail}</p>
                      <p className="font-body text-cream/50 text-sm mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-10 border-t border-cream/10">
                <p className="font-body text-cream/60 italic leading-relaxed">
                  "Baking is a language of its own. We're here to help you translate your vision into a perfect loaf."
                </p>
                <p className="font-heading font-bold mt-4 text-primary">— Alice Thornton, Founder</p>
              </div>
            </div>
          </div>

          {/* ---- Right Side: Contact Form ---- */}
          <div className="lg:col-span-7 flex">
            <div className="w-full bg-card rounded-[2.5rem] border border-border p-10 md:p-14 shadow-xl backdrop-blur-sm flex flex-col">
              <div className="mb-10">
                <h2 className="font-heading text-4xl font-bold text-foreground mb-4">Send a Message</h2>
                <p className="font-body text-muted-foreground text-lg">Tell us what's on your mind. We read every single note.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-heading text-sm font-bold text-foreground uppercase tracking-widest px-1">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })} 
                      placeholder="Jane Doe" 
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/20 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-heading text-sm font-bold text-foreground uppercase tracking-widest px-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={form.email} 
                      onChange={e => setForm({ ...form, email: e.target.value })} 
                      placeholder="jane@example.com" 
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/20 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-heading text-sm font-bold text-foreground uppercase tracking-widest px-1">Subject</label>
                  <input 
                    type="text" 
                    required 
                    value={form.subject} 
                    onChange={e => setForm({ ...form, subject: e.target.value })} 
                    placeholder="How can we help you?" 
                    className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/20 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-heading text-sm font-bold text-foreground uppercase tracking-widest px-1">Your Message</label>
                  <textarea 
                    required 
                    rows={6} 
                    value={form.message} 
                    onChange={e => setForm({ ...form, message: e.target.value })} 
                    placeholder="Type your message here..." 
                    className="w-full px-6 py-4 rounded-2xl border border-border bg-secondary/20 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all resize-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={cn(
                    "w-full bg-primary text-primary-foreground px-8 py-5 rounded-[1.5rem] font-heading font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 hover:shadow-2xl",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  ) : (
                    <>
                      <SendHorizonal size={22} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ---- FAQ Call to Action ---- */}
      <section className="bg-secondary/30 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="grid grid-cols-6 gap-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <Sparkles key={i} className="text-foreground" size={60} />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6 italic">Quick Answers?</h2>
            <p className="font-body text-muted-foreground text-xl mb-10 leading-relaxed">
              Before you hit send, check out our comprehensive help center. We've likely already answered your question there!
            </p>
            <a 
              href="/faq" 
              className="inline-flex items-center gap-3 bg-card border-2 border-primary text-primary px-10 py-4 rounded-2xl font-heading font-bold text-lg hover:bg-primary hover:text-cream transition-all group shadow-lg"
            >
              Browse the FAQ
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
