// ==================== BLOG / RECIPES PAGE ====================
// Displays all recipes as cards with difficulty badges
// Each card links to the full recipe detail page
// ===========================================================

import { useState, useMemo, useEffect } from "react";
import { NotebookPen, Sparkles } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import FeaturedRecipe from "@/components/FeaturedRecipe";
import { api, BackendRecipe } from "@/lib/api";

// ---- Blog Page Component ----
const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [recipes, setRecipes] = useState<BackendRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await api.getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Failed to load recipes", err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipes; // No categories in BackendRecipe yet
  }, [recipes, selectedCategory]);

  const featured = recipes.length > 2 ? recipes[2] : recipes[0];

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Page Header: Artistic & Bold ---- */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-bl-[10rem] -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <NotebookPen size={18} strokeWidth={2} className="text-primary" />
            <span className="font-heading text-sm font-bold text-primary uppercase tracking-widest">Whiffle Kitchen Notes</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            The Art of <span className="italic text-primary underline decoration-primary/20 underline-offset-8">Gentle</span> Baking
          </h1>
          <p className="font-body text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Explore our curated collection of step-by-step guides, from effortless morning muffins to rewarding weekend projects.
          </p>
        </div>
      </section>

      {/* ---- Featured Recipe Section ---- */}
      {!loading && featured && (
        <FeaturedRecipe 
          recipe={{
            id: String(featured.id),
            title: featured.title,
            difficulty: (featured.difficulty.charAt(0).toUpperCase() + featured.difficulty.slice(1)) as any,
            time: featured.prep_time || "30 min",
            servings: String(featured.servings || 4),
            description: featured.description,
            ingredients: [],
            steps: [],
            tips: [],
            category: "Baking"
          }} 
          image={featured.image_url} 
        />
      )}

      {/* ---- Main Grid Section ---- */}
      <section className="container mx-auto px-4 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
              <Sparkles className="text-primary" size={24} />
              Browse All Collections
            </h2>
            <p className="font-body text-muted-foreground mt-2">Find exactly what your kitchen needs today.</p>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredRecipes.map((recipe, index) => (
            <div 
              key={recipe.id}
              className="animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RecipeCard 
                recipe={{
                  id: String(recipe.slug), // Use slug so the link goes to /recipe/:slug
                  title: recipe.title,
                  difficulty: (recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)) as any,
                  time: recipe.prep_time || "30 min",
                  servings: String(recipe.servings || 4),
                  description: recipe.description,
                  ingredients: [],
                  steps: [],
                  tips: [],
                  category: "Baking"
                }} 
                image={recipe.image_url} 
              />
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-20">
            <p className="font-heading text-2xl text-muted-foreground italic">No recipes found in this category yet. Stay tuned!</p>
          </div>
        )}
      </section>

      {/* ---- Newsletter Section Link ---- */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-heading text-4xl font-bold text-foreground mb-4 italic">Never miss a kitchen note.</h2>
          <p className="font-body text-muted-foreground mb-8">Sign up for our seasonal digest of recipes, tool guides, and baking secrets.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary font-body"
            />
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-heading font-bold hover:bg-primary/90 transition-all">
              Join the Kitchen
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
// ==================== END BLOG / RECIPES PAGE ====================
