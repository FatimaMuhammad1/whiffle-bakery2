import React from 'react';
import { cn } from "@/lib/utils";

interface RecipeFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <button
        onClick={() => onCategoryChange("All")}
        className={cn(
          "px-6 py-2 rounded-full font-heading font-semibold transition-all duration-300 border-2",
          selectedCategory === "All"
            ? "bg-primary border-primary text-cream shadow-lg shadow-primary/20 scale-105"
            : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
        )}
      >
        All Recipes
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={cn(
            "px-6 py-2 rounded-full font-heading font-semibold transition-all duration-300 border-2",
            selectedCategory === cat
              ? "bg-primary border-primary text-cream shadow-lg shadow-primary/20 scale-105"
              : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default RecipeFilters;
