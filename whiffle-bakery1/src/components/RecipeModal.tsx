import { useState, useEffect } from "react";
import { X, Save, FileText, Tag, Clock, Users, Globe, BookOpen } from "lucide-react";
import { type BackendRecipe, api } from "@/lib/api";
import { toast } from "sonner";

type RecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  recipe?: BackendRecipe | null;
};

const RecipeModal = ({ isOpen, onClose, onSave, recipe }: RecipeModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    image_url: "",
    prep_time: "",
    cook_time: "",
    difficulty: "intermediate",
    servings: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        content: recipe.content,
        image_url: recipe.image_url || "",
        prep_time: recipe.prep_time || "",
        cook_time: recipe.cook_time || "",
        difficulty: recipe.difficulty,
        servings: recipe.servings?.toString() || ""
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        content: "",
        image_url: "",
        prep_time: "",
        cook_time: "",
        difficulty: "intermediate",
        servings: ""
      });
    }
  }, [recipe, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        servings: formData.servings ? parseInt(formData.servings) : undefined
      };

      if (recipe) {
        await api.updateRecipe(recipe.id, payload);
        toast.success("Recipe updated successfully");
      } else {
        await api.createRecipe(payload);
        toast.success("Recipe created successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error("Failed to save recipe. Ensure slug is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-chocolate/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
        {/* Header */}
        <div className="bg-chocolate p-8 text-cream flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold">{recipe ? "Edit Recipe" : "New Recipe"}</h2>
              <p className="text-cream/60 text-sm font-body">Artisan Recipe Studio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Title</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="e.g. Grandma's Sourdough"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Slug</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="e.g. grandmas-sourdough"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Prep Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="20 mins"
                  value={formData.prep_time}
                  onChange={e => setFormData({ ...formData, prep_time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Cook Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="45 mins"
                  value={formData.cook_time}
                  onChange={e => setFormData({ ...formData, cook_time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Difficulty</label>
              <select
                className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Servings</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="number"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="4"
                  value={formData.servings}
                  onChange={e => setFormData({ ...formData, servings: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Image URL</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                placeholder="https://..."
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Short Description</label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              placeholder="A brief summary of the dish..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Full Content (Instructions)</label>
            <textarea
              rows={6}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              placeholder="List ingredients and steps here..."
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-border font-heading font-bold text-chocolate hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 py-4 rounded-2xl bg-chocolate text-cream font-heading font-bold hover:opacity-90 transition-all shadow-xl shadow-chocolate/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} /> {recipe ? "Update Recipe" : "Publish Recipe"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeModal;
