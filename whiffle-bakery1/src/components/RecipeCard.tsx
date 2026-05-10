import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, UsersRound, ChevronRight, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Recipe } from "@/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  image?: string;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, image, className }) => {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className={cn(
        "group relative bg-card rounded-[2rem] border border-border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
        className
      )}
    >
      {/* ---- Image Section ---- */}
      <div className="relative h-96 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={recipe.title} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-soft-pink/30 flex items-center justify-center">
            <span className="font-heading text-primary/20 text-4xl italic">Whiffle</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn(
            "text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-sm",
            recipe.difficulty === "Easy" ? "bg-green-500/20 text-green-700 border border-green-500/30" :
            recipe.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-700 border border-yellow-500/30" :
            "bg-red-500/20 text-red-700 border border-red-500/30"
          )}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <span className="text-cream font-heading font-semibold flex items-center gap-2">
            View Full Recipe <ChevronRight size={16} />
          </span>
        </div>
      </div>

      {/* ---- Content Section ---- */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="font-body text-xs font-semibold text-primary/70 uppercase tracking-wider">
            {recipe.category}
          </span>
          <div className="flex text-yellow-500">
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
          </div>
        </div>
        
        <h3 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
          {recipe.title}
        </h3>
        
        <p className="font-body text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 font-body text-xs text-muted-foreground font-medium">
              <Clock3 size={14} className="text-primary/60" /> {recipe.time}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-muted-foreground font-medium">
              <UsersRound size={14} className="text-primary/60" /> {recipe.servings}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
