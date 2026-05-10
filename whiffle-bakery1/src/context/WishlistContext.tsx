import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product } from "@/data/products";
import { api } from "@/lib/api";
import { toFrontendProduct } from "@/lib/productAdapter";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type WishlistContextType = {
  items: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getWishlist();
      setItems(data.map(toFrontendProduct));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (product: Product) => {
    if (!user) {
      toast.error("Please login to save to wishlist");
      return;
    }

    // Optimistic update
    setItems(prev => prev.some(i => i.id === product.id) ? prev : [...prev, product]);

    try {
      if (product.backendId) {
        await api.addToWishlist(product.backendId);
      }
    } catch (err) {
      // Revert on error
      setItems(prev => prev.filter(i => i.id !== product.id));
      toast.error("Failed to add to wishlist");
    }
  }, [user]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    const product = items.find(i => i.id === productId);
    if (!product) return;

    // Optimistic update
    setItems(prev => prev.filter(i => i.id !== productId));

    try {
      if (product.backendId) {
        await api.removeFromWishlist(product.backendId);
      }
    } catch (err) {
      // Revert on error
      setItems(prev => [...prev, product]);
      toast.error("Failed to remove from wishlist");
    }
  }, [items]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(i => i.id === productId);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, totalItems: items.length, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
