// ==================== SHOP PAGE ====================
// Main product listing with sidebar filters, category tabs,
// sort, pagination, and newsletter section
// ===================================================

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { products, categories as localCategories, brands as localBrands } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import shopBanner from "@/assets/shop-banner.jpg";
import featuredDealBg from "@/assets/featured-deal.jpg";
import { ChevronDown, Mail, MoreHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import { toFrontendProduct } from "@/lib/productAdapter";

const ITEMS_PER_PAGE = 12;

// ---- Shop Page Component ----
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("q") || "";

  // ---- Filter & Sort State ----
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [onSaleFilter, setOnSaleFilter] = useState(false);
  const [inStockFilter, setInStockFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("price-low");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [allProducts, setAllProducts] = useState(products);
  const [allCategories, setAllCategories] = useState(localCategories);
  const [allBrands, setAllBrands] = useState(localBrands);
  // ---- End Filter & Sort State ----

  useEffect(() => {
    let cancelled = false;

    const loadProductsFromApi = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.getProducts({ 
            limit: 100, 
            q: searchQuery || undefined 
          }),
          api.getCategories(),
        ]);

        if (cancelled) return;

        const mapped = productRes.items.map(toFrontendProduct);
        setAllProducts(mapped);
        const categoryNames = categoryRes.map(c => c.name);
        setAllCategories(["All", ...categoryNames]);
        setAllBrands(Array.from(new Set(mapped.map(p => p.brand))));
      } catch {
        // Keep local fallback data if API is unavailable.
      }
    };

    void loadProductsFromApi();

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  // ---- Category Change Handler ----
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };
  // ---- End Category Change Handler ----

  // ---- Brand Toggle Handler ----
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };
  // ---- End Brand Toggle Handler ----

  // ---- Filter & Sort Logic ----
  const filtered = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }
    // Sale filter
    if (onSaleFilter) result = result.filter(p => p.originalPrice);
    // Stock filter
    if (inStockFilter) result = result.filter(p => p.inStock);
    // Rating filter
    if (ratingFilter) result = result.filter(p => p.rating >= 4.5);

    // Price range filter
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) result = result.filter(p => p.price >= min);
    if (!isNaN(max)) result = result.filter(p => p.price <= max);

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Sort
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popular": result.sort((a, b) => b.reviews - a.reviews); break;
    }
    return result;
  }, [allProducts, selectedCategory, sortBy, onSaleFilter, inStockFilter, ratingFilter, minPrice, maxPrice, selectedBrands]);
  // ---- End Filter & Sort Logic ----

  // ---- Pagination ----
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 3 && currentPage < totalPages - 1) {
        pages.push("ellipsis", currentPage);
      } else {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }
    return pages;
  };
  // ---- End Pagination ----

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* ---- Shop Banner ---- */}
      <section className="relative h-[220px] overflow-hidden">
        <img src={shopBanner} alt="Bakeware Essentials" className="w-full h-full object-cover" width={1920} height={512} />
        <div className="absolute inset-0 bg-gradient-to-r from-chocolate/70 to-chocolate/30 flex items-center justify-center text-center">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream italic mb-2">Bakeware Essentials</h1>
            <p className="font-body text-cream/80 text-lg mb-4">Everything you need for the perfect bake!</p>
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity">
              Shop Now
            </button>
          </div>
        </div>
      </section>
      {/* ---- End Shop Banner ---- */}

      {/* ---- Category Tabs ---- */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-6 py-3 scrollbar-hide">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`font-body whitespace-nowrap py-2 px-1 border-b-2 transition-colors text-sm ${selectedCategory === cat
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* ---- End Category Tabs ---- */}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ---- Sidebar Filters ---- */}
          <aside className="hidden lg:block w-52 shrink-0 space-y-4">
            {/* Categories sidebar list */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-heading font-bold text-primary-foreground bg-primary px-3 py-2 rounded-lg text-sm mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`block w-full text-left font-body text-sm py-1.5 px-2 rounded transition-colors ${cat === selectedCategory
                        ? "text-primary font-semibold underline"
                        : "text-foreground hover:text-primary"
                      }`}
                  >
                    {cat === "All" ? "All Products" : cat}
                  </button>
                ))}
              </div>
            </div>
            {/* End categories sidebar */}

            {/* ---- Price Filter ---- */}
            <div className="bg-card rounded-xl border border-border p-4">
              <button
                onClick={() => setPriceOpen(!priceOpen)}
                className="flex items-center justify-between w-full font-heading font-bold text-foreground text-sm"
              >
                Price Range <ChevronDown size={16} strokeWidth={2} className={`transition-transform ${priceOpen ? "rotate-180" : ""}`} />
              </button>
              {priceOpen && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2 py-1.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="font-body text-muted-foreground self-center">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2 py-1.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}
            </div>
            {/* ---- End Price Filter ---- */}

            {/* ---- Brand Filter ---- */}
            <div className="bg-card rounded-xl border border-border p-4">
              <button
                onClick={() => setBrandOpen(!brandOpen)}
                className="flex items-center justify-between w-full font-heading font-bold text-foreground text-sm"
              >
                Brand <ChevronDown size={16} strokeWidth={2} className={`transition-transform ${brandOpen ? "rotate-180" : ""}`} />
              </button>
              {brandOpen && (
                <div className="mt-3 space-y-2">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-border accent-primary"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* ---- End Brand Filter ---- */}

            {/* ---- Other Filters ---- */}
            <div className="bg-card rounded-xl border border-border p-4">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-between w-full font-heading font-bold text-foreground text-sm"
              >
                Filter By <ChevronDown size={16} strokeWidth={2} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>
              {filterOpen && (
                <div className="mt-3 space-y-2.5">
                  {[
                    { label: "Top Rated (4.5+)", checked: ratingFilter, onChange: () => { setRatingFilter(!ratingFilter); setCurrentPage(1); } },
                    { label: "On Sale", checked: onSaleFilter, onChange: () => { setOnSaleFilter(!onSaleFilter); setCurrentPage(1); } },
                    { label: "In Stock", checked: inStockFilter, onChange: () => { setInStockFilter(!inStockFilter); setCurrentPage(1); } },
                  ].map(f => (
                    <label key={f.label} className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
                      <input type="checkbox" checked={f.checked} onChange={f.onChange} className="rounded border-border accent-primary" />
                      {f.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* ---- End Other Filters ---- */}

            {/* ---- Sort By ---- */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-heading font-bold text-foreground text-sm mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            {/* ---- End Sort By ---- */}
          </aside>
          {/* ---- End Sidebar Filters ---- */}

          {/* ---- Products Grid ---- */}
          <div className="flex-1">
            {searchQuery && (
              <div className="mb-6 flex items-center justify-between bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <p className="font-body text-chocolate dark:text-cream">
                  Showing results for <span className="font-bold italic">"{searchQuery}"</span>
                </p>
                <button 
                  onClick={() => {
                    searchParams.delete("q");
                    setSearchParams(searchParams);
                  }}
                  className="text-xs font-heading font-bold text-primary uppercase tracking-widest hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}

            <p className="font-body text-muted-foreground text-sm mb-4">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}&mdash;{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} Products
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-heading text-lg text-muted-foreground">No products match your filters.</p>
                <button
                  onClick={() => { setSelectedBrands([]); setMinPrice(""); setMaxPrice(""); setRatingFilter(false); setOnSaleFilter(false); setInStockFilter(false); }}
                  className="mt-4 text-primary hover:underline font-body"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginated.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* ---- Pagination Controls ---- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-border font-body text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  Prev
                </button>
                {getPageNumbers().map((page, i) =>
                  page === "ellipsis" ? (
                    <span key={`e-${i}`} className="px-2 py-2 font-body text-sm text-muted-foreground">
                      <MoreHorizontal size={16} strokeWidth={2} />
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg font-body text-sm transition-colors ${currentPage === page
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "border border-border hover:bg-secondary"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-border font-body text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
            {/* ---- End Pagination Controls ---- */}
          </div>
          {/* ---- End Products Grid ---- */}
        </div>
      </div>

      {/* ---- Featured Deal Banner ---- */}
      <section className="relative h-[260px] overflow-hidden">
        <img src={featuredDealBg} alt="Featured Deal" className="w-full h-full object-cover" loading="lazy" width={1920} height={512} />
        <div className="absolute inset-0 bg-chocolate/60 flex items-center justify-center text-center">
          <div>
            <h2 className="font-heading text-3xl font-bold text-cream mb-2">Featured Deal</h2>
            <p className="font-body text-cream/90 text-lg mb-6">Limited Time Offer: 25% Off Bakeware Sets!</p>
            <Link to="/shop?category=Bundles" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      {/* ---- End Featured Deal Banner ---- */}

      {/* ---- Newsletter Section ---- */}
      <section className="bg-gradient-to-r from-chocolate to-chocolate-light py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cream/10 px-4 py-2 rounded-full mb-4">
            <Mail size={16} strokeWidth={2} className="text-cream" />
            <span className="font-heading text-sm font-semibold text-cream">Stay Updated</span>
          </div>
          <h2 className="font-heading text-[2.15rem] md:text-[2.75rem] font-bold text-cream mb-3 leading-[1.05]">Join Our Mailing List</h2>
          <p className="font-body text-cream/80 mb-6 mx-auto max-w-xl text-base md:text-lg">Get the latest recipes and special offers!</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-cream/20 bg-cream/10 text-cream placeholder:text-cream/50 font-body focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-heading font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      {/* ---- End Newsletter Section ---- */}
    </div>
  );
};
// ---- End Shop Page Component ----

export default Shop;
// ==================== END SHOP PAGE ====================
