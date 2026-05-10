// ==================== ABOUT PAGE ====================
// Company story, mission, vision, values, and stats
// ===================================================

import { Link } from "react-router-dom";
import { BadgeCheck, Leaf, NotebookPen, Ribbon, Sparkles, UsersRound, Heart, Timer, ShoppingBag } from "lucide-react";
import IconBadge from "@/components/IconBadge";
import StorySection from "@/components/StorySection";
import QuoteCarousel from "@/components/QuoteCarousel";
import TeamCard from "@/components/TeamCard";

import heroBg from "@/assets/hero-bakery.jpg";
import featuredDealBg from "@/assets/featured-deal.jpg";
import starterKitsBg from "@/assets/starter-kits-banner.jpg";
import storyBeginning from "@/assets/story-beginning.jpg";
import teamAlice from "@/assets/team-alice.jpg";
import teamMarcus from "@/assets/team-marcus.jpg";
import teamElena from "@/assets/team-elena.jpg";
// Fallbacks for missing images to prevent crash
import bakingProcess from "@/assets/hero-bakery.jpg";
import vision1 from "@/assets/about-vision-1.jpg";
import vision2 from "@/assets/about-vision-2.jpg";
import vision3 from "@/assets/about-vision-3.jpg";
import vision4 from "@/assets/about-vision-4.jpg";
// ---- About Page Component ----
const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* ---- Hero Section: Immersive & Bold ---- */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="About Whiffle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-chocolate/60 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-2 mb-6 text-cream/90 backdrop-blur-sm font-body text-xs uppercase tracking-[0.3em]">
              Our Journey
            </span>
            <h1 className="font-heading text-6xl md:text-8xl font-bold text-cream mb-6 drop-shadow-2xl">
              Crafting <span className="italic text-primary">Joy</span> In Every Batch
            </h1>
            <p className="font-body text-cream/90 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
              We believe baking is more than just a recipe—it's a moment of connection, a spark of creativity, and a dash of home.
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-cream/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ---- Our Story: Detailed Narrative ---- */}
      <StorySection
        eyebrow="The Beginning"
        title="Born From a Simple Kitchen Curiosity"
        subtitle="How Whiffle started with a burnt batch of cookies and a big dream."
        content={
          <>
            <p>
              It started in 2024, in a small kitchen filled with the scent of vanilla and the frustration of a collapsed souffle. We realized that while everyone wanted to bake, not everyone felt like a "baker." The tools were intimidating, the instructions were cryptic, and the joy was often lost in technicality.
            </p>
            <p>
              Whiffle was founded to bridge that gap. We stripped away the pretension and focused on what truly matters: high-quality essentials that feel good in your hands, ingredients that respect the Earth, and guidance that feels like a friend standing beside you at the counter.
            </p>
          </>
        }
        image={storyBeginning}
        imageAlt="Whiffle founders in the kitchen"
      />

      {/* ---- Our Process: Three-Column Grid ---- */}
      <section className="py-24 bg-secondary/20 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <img src={bakingProcess} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow">How We Work</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Our Mindful Process</h2>
            <p className="font-body text-muted-foreground text-lg">Every product that earns a place in our shop goes through a rigorous journey of testing and refinement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: NotebookPen,
                title: "Thoughtful Curation",
                desc: "We don't just sell tools; we select companions. Every spatula and tin is chosen for its ergonomics, durability, and 'smile-factor' during use."
              },
              {
                icon: Heart,
                title: "Ethical Sourcing",
                desc: "From our silicone mats to our flour blends, we prioritize partners who value sustainability and fair labor as much as we do."
              },
              {
                icon: Timer,
                title: "Real-World Testing",
                desc: "Before a product reaches you, it spends weeks in our own home kitchens, facing everything from messy toddlers to professional pastry projects."
              }
            ].map((item, i) => (
              <div key={i} className="bg-card p-10 rounded-[2rem] border border-border hover:shadow-xl transition-all duration-500 group">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary rounded-2xl flex items-center justify-center text-primary dark:text-cream mb-8 group-hover:bg-primary group-hover:text-cream transition-all duration-500 shadow-sm dark:shadow-lg dark:shadow-primary/20">
                  <item.icon size={32} strokeWidth={2.5} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Vision & Mission: Side-by-Side ---- */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-12">
                <div>
                  <h2 className="font-heading text-4xl font-bold text-foreground mb-6 flex items-center gap-4">
                    <Sparkles className="text-primary" /> Our Mission
                  </h2>
                  <p className="font-body text-lg text-muted-foreground leading-relaxed">
                    To empower every home baker—from the nervous first-timer to the seasoned Sunday pro—with the confidence, tools, and community needed to create delicious memories. We exist to make the kitchen the happiest room in your house.
                  </p>
                </div>
                <div>
                  <h2 className="font-heading text-4xl font-bold text-foreground mb-6 flex items-center gap-4">
                    <Ribbon className="text-primary" /> Our Vision
                  </h2>
                  <p className="font-body text-lg text-muted-foreground leading-relaxed">
                    We envision a world where baking isn't seen as a chore or a challenge, but as a universal language of love and creativity. Whiffle aims to be the global hearth for this community, fostering inspiration and skill for generations to come.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={vision1} className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Our beginnings" loading="lazy" />
              <img src={vision2} className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Curated tools" loading="lazy" />
              <img src={vision3} className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Freshly baked" loading="lazy" />
              <img src={vision4} className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Artisan craft" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Testimonials: Quote Carousel ---- */}
      <QuoteCarousel />

      {/* ---- Values: Icon Grid ---- */}
      <section className="py-24 bg-chocolate text-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block border border-cream/30 px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-4">Core Values</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { icon: BadgeCheck, title: "Quality First" },
              { icon: UsersRound, title: "Community" },
              { icon: Leaf, title: "Sustainability" },
              { icon: NotebookPen, title: "Education" },
              { icon: Sparkles, title: "Passion" },
              { icon: Ribbon, title: "Excellence" },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="w-16 h-16 mx-auto bg-cream/20 dark:bg-primary rounded-full flex items-center justify-center text-cream dark:text-cream group-hover:bg-primary transition-all duration-300 shadow-sm dark:shadow-lg dark:shadow-primary/20">
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                <p className="font-heading text-lg font-medium">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Meet the Team: Team Grid ---- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow">The Bakers Behind the Brand</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Meet the Whiffle Team</h2>
            <p className="font-body text-muted-foreground text-lg">A group of recipe developers, product designers, and cookie enthusiasts dedicated to your kitchen success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamCard
              name="Alice Thornton"
              role="Founder & Creative Director"
              bio="With 15 years of pastry experience, Alice started Whiffle to bring professional-grade tools to home kitchens."
              image={teamAlice}
            />
            <TeamCard
              name="Marcus Rivera"
              role="Head of Product Design"
              bio="Marcus ensures that every Whiffle tool is as beautiful to look at as it is functional to use."
              image={teamMarcus}
            />
            <TeamCard
              name="Elena Kim"
              role="Community & Education"
              bio="Elena is the voice behind our guides and recipes, helping thousands of bakers find their confidence."
              image={teamElena}
            />
          </div>
        </div>
      </section>

      {/* ---- Stats Banner: Dark & Sophisticated ---- */}
      <section className="relative py-20 bg-chocolate text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={featuredDealBg} className="w-full h-full object-cover" alt="Stats background" loading="lazy" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { num: "100+", label: "Curated Products" },
              { num: "10K+", label: "Happy Home Bakers" },
              { num: "50+", label: "Step-by-Step Recipes" },
              { num: "4.8", label: "Average Community Rating" },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="font-heading text-5xl md:text-6xl font-bold text-primary italic">
                  {s.num}
                </div>
                <div className="font-body text-cream/70 text-sm uppercase tracking-widest">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Section: Light & Airy ---- */}
      <section className="py-32 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="mb-12">
            <ShoppingBag className="mx-auto text-primary mb-6" size={48} />
            <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
              Ready to Write Your Own <span className="italic">Baking Story?</span>
            </h2>
            <p className="font-body text-xl text-muted-foreground leading-relaxed">
              Browse our curated collection and find the perfect companions for your next kitchen adventure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/shop"
              className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-heading text-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20"
            >
              Shop the Collection
            </Link>
            <Link
              to="/blog"
              className="bg-card text-foreground border border-border px-10 py-4 rounded-2xl font-heading text-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
// ---- End About Page Component ----

export default About;
// ==================== END about PAGE ====================
