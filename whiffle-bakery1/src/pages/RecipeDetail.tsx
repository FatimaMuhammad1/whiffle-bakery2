// ==================== RECIPE DETAIL PAGE ====================
// Displays a single recipe with full ingredients, steps, and tips
// Accessible via /recipe/:id route
// ===========================================================

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, UsersRound, ChefHat, ScrollText, Lightbulb, Share2, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, BackendRecipe } from "@/lib/api";

// ---- Recipe Detail Component ----
const RecipeDetail = () => {
  const { id } = useParams(); // id is the slug now
  const [recipe, setRecipe] = useState<BackendRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      try {
        const data = await api.getRecipeBySlug(id);
        setRecipe(data);
      } catch (err) {
        console.error("Failed to load recipe", err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  // ---- Not Found State ----
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Loading Recipe...</h1>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Recipe Not Found</h1>
        <p className="font-body text-muted-foreground mb-8 text-lg">The recipe you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Recipes
        </Link>
      </div>
    );
  }

  const difficultyStr = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);

  // ---- Difficulty Color Helper ----
  const difficultyStyles = 
    difficultyStr === "Beginner" ? "bg-green-500/10 text-green-700 border-green-500/20" :
    difficultyStr === "Intermediate" ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" :
    "bg-red-500/10 text-red-700 border-red-500/20";

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Breadcrumb & Actions ---- */}
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/blog" className="font-body text-sm text-primary font-bold hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Recipes
        </Link>
        <div className="flex gap-3">
          <button className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors" title="Share">
            <Share2 size={18} />
          </button>
          <button onClick={() => window.print()} className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors" title="Print">
            <Printer size={18} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        {/* ---- Recipe Header Hero ---- */}
        <section className="relative rounded-[3rem] overflow-hidden bg-chocolate mb-12 shadow-2xl min-h-[600px] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-chocolate/30 to-transparent z-10" />
          
          <div className="absolute inset-0">
            {recipe.image_url ? (
              <img 
                src={recipe.image_url} 
                alt={recipe.title} 
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-chocolate" />
            )}
          </div>
          
          <div className="relative z-20 p-8 md:p-16 w-full animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={cn("text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border", difficultyStyles)}>
                {difficultyStr}
              </span>
              <span className="font-body text-sm text-cream/80 bg-cream/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Clock3 size={16} /> {recipe.prep_time || "30 min"}
              </span>
              <span className="font-body text-sm text-cream/80 bg-cream/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                <UsersRound size={16} /> {recipe.servings || 4}
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-cream mb-6 leading-tight max-w-4xl">
              {recipe.title}
            </h1>
            <p className="font-body text-cream/70 text-lg md:text-xl max-w-2xl leading-relaxed italic">
              "{recipe.description}"
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* ---- Main Column: Recipe Content ---- */}
          <main className="lg:col-span-3 space-y-12">
            <div className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border shadow-sm">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-10 flex items-center gap-3">
                <ScrollText className="text-primary" size={28} />
                Method & Ingredients
              </h2>
              <div className="space-y-6">
                {recipe.content.split("\n").map((line, i) => {
                  if (line.startsWith("###")) {
                    return <h3 key={i} className="font-heading text-2xl font-bold mt-8 mb-4">{line.replace("###", "").trim()}</h3>;
                  } else if (line.startsWith("- ")) {
                    return <li key={i} className="ml-6 font-body text-foreground/90 text-lg">{line.replace("- ", "").trim()}</li>;
                  } else if (line.match(/^\d+\./)) {
                    return <p key={i} className="font-body text-foreground text-lg leading-relaxed mt-4 pl-4 border-l-4 border-primary/20">{line.replace(/^\d+\./, "").trim()}</p>;
                  } else if (line.trim()) {
                    return <p key={i} className="font-body text-foreground text-lg mb-2">{line.trim()}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
// ==================== END RECIPE DETAIL PAGE ====================
