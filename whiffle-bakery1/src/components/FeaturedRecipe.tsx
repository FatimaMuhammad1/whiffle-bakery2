import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, UsersRound, ArrowRight, Sparkles } from 'lucide-react';
import { Recipe } from "@/data/recipes";

interface FeaturedRecipeProps {
  recipe: Recipe;
  image?: string;
}

const FeaturedRecipe: React.FC<FeaturedRecipeProps> = ({ recipe, image }) => {
  return (
    <section className="container mx-auto px-4 mb-20">
      <div className="relative group overflow-hidden rounded-[3rem] bg-chocolate border border-border shadow-2xl min-h-[500px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          {image ? (
            <img 
              src={image} 
              alt={recipe.title} 
              className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-chocolate to-primary/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-chocolate via-chocolate/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full mb-6 text-primary-foreground">
            <Sparkles size={16} className="text-primary" />
            <span className="font-heading text-sm font-bold uppercase tracking-widest">Recipe of the Week</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-cream mb-6 leading-tight">
            {recipe.title}
          </h2>
          
          <p className="font-body text-cream/80 text-lg md:text-xl mb-8 leading-relaxed line-clamp-3">
            {recipe.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-cream/90">
              <Clock3 size={20} className="text-primary" />
              <span className="font-body font-semibold">{recipe.time}</span>
            </div>
            <div className="flex items-center gap-2 text-cream/90">
              <UsersRound size={20} className="text-primary" />
              <span className="font-body font-semibold">{recipe.servings}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-full text-xs font-bold text-primary uppercase">
                {recipe.difficulty}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/recipe/${recipe.id}`}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-heading text-xl font-semibold hover:bg-primary/90 transition-all hover:translate-x-2 shadow-xl shadow-primary/20"
          >
            Start Baking <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipe;
