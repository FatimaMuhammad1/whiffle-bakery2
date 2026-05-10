import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Heart, Search, CircleUserRound, AlignRight, X, Moon, Sun, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import WhiffleLogo from "@/components/WhiffleLogo";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const { totalItems: wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/blog", label: "Recipes" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b-2 border-primary/30 shadow-sm transition-all duration-500">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-foreground hover:opacity-80 transition-opacity">
          <WhiffleLogo className="h-16 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-foreground hover:text-primary transition-colors font-bold uppercase tracking-wider text-[11px]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-foreground hover:bg-primary/10 transition-all active:scale-90"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
          </button>

          <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground hover:text-primary transition-colors">
            <Search size={20} strokeWidth={2} />
          </button>

          <Link to="/wishlist" className="relative text-foreground hover:text-primary transition-colors">
            <Heart size={20} strokeWidth={2} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-cream text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag size={20} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-cream text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-foreground hover:text-primary transition-colors hidden md:block"
              title="Admin Dashboard"
            >
              <LayoutDashboard size={20} strokeWidth={2} />
            </Link>
          )}

          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="text-foreground hover:text-primary transition-colors hidden md:block"
            title={isAuthenticated ? "Account" : "Login"}
          >
            <CircleUserRound size={20} strokeWidth={2} />
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
            {mobileOpen ? <X size={24} strokeWidth={2} /> : <AlignRight size={24} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3 bg-card animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="container mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for bakeware, ingredients, recipes..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block font-body text-foreground hover:text-primary font-bold uppercase tracking-widest text-xs py-2">
              {link.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block font-body text-foreground hover:text-primary font-bold uppercase tracking-widest text-xs py-2">
              Login / Signup
            </Link>
          ) : (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block font-body text-foreground hover:text-primary font-bold uppercase tracking-widest text-xs py-2">
                My Profile
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  setMobileOpen(false);
                }}
                className="block font-body text-foreground hover:text-primary font-bold uppercase tracking-widest text-xs py-2 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
