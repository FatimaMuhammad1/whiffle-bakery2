import { useState, useEffect } from "react";
import { X, Save, Package, Image as ImageIcon, Tag, DollarSign, ListOrdered } from "lucide-react";
import { type BackendProduct, api } from "@/lib/api";
import { toast } from "sonner";

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: BackendProduct | null;
  categories: { id: number; name: string }[];
};

const ProductModal = ({ isOpen, onClose, onSave, product, categories }: ProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    image_url: "",
    slug: "",
    brand: "Whiffle",
    is_available: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        category_id: product.category_id?.toString() || "",
        image_url: product.image_url || "",
        slug: product.slug,
        brand: product.brand || "Whiffle",
        is_available: product.is_available ?? true
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category_id: "",
        image_url: "",
        slug: "",
        brand: "Whiffle",
        is_available: true
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        is_available: formData.is_available
      };
// ... rest ...

      if (product) {
        await api.updateProduct(product.id, payload);
        toast.success("Product updated successfully");
      } else {
        await api.createProduct(payload);
        toast.success("Product created successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product. Check if slug is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-chocolate/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
        {/* Header */}
        <div className="bg-chocolate p-8 text-cream flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold">{product ? "Edit Product" : "New Product"}</h2>
              <p className="text-cream/60 text-sm font-body">Artisan Inventory Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Product Name</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="e.g. Bicarbonate of Soda"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">URL Slug</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="e.g. bicarbonate-soda-200g"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Stock Quantity</label>
              <div className="relative">
                <ListOrdered className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  required
                  type="number"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="0"
                  value={formData.stock_quantity}
                  onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Category</label>
              <select
                className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-secondary/5 rounded-2xl border border-border/50">
              <input
                type="checkbox"
                id="is_available"
                className="w-5 h-5 rounded-lg border-chocolate text-chocolate focus:ring-primary/20"
                checked={formData.is_available}
                onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
              />
              <label htmlFor="is_available" className="font-heading font-bold text-chocolate text-sm cursor-pointer select-none">
                Make product available in store
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-chocolate uppercase tracking-widest ml-1">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              placeholder="Tell the story of this product..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                  <Save size={18} /> {product ? "Update Product" : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
