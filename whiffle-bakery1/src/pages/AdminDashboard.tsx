// ==================== ADMIN DASHBOARD ====================
// Dedicated Full-Screen SaaS Command Center for Bakery Logistics
// =========================================================

import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Search, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Trash2,
  Edit,
  Filter,
  RefreshCcw,
  Truck,
  Menu,
  X,
  Sun,
  Moon,
  LogOut
} from "lucide-react";
import { api, type BackendProduct, type BackendOrder, type BackendUser } from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProductModal from "@/components/ProductModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import WhiffleLogo from "@/components/WhiffleLogo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BackendProduct | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // SaaS sidebar state
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Local Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Process data for the sales chart
  const salesData = (() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return format(d, 'MMM dd');
    });

    const dataMap = orders.reduce((acc, order) => {
      const date = format(new Date(order.created_at), 'MMM dd');
      acc[date] = (acc[date] || 0) + Number(order.total_amount);
      return acc;
    }, {} as Record<string, number>);

    return last7Days.map(date => ({
      name: date,
      sales: dataMap[date] || 0
    }));
  })();

  // Security: Prevent search engine indexing
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      if (document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, catRes, userRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getOrders(), 
        api.getCategories(),
        api.getUsers(),
      ]);
      setProducts(prodRes.items);
      setOrders(orderRes);
      setCategories(catRes);
      setUsers(userRes);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? Data cannot be recovered.")) return;
    try {
      await api.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success("Order deleted");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: "Total Revenue", value: `$${orders.reduce((acc, o) => acc + Number(o.total_amount), 0).toFixed(2)}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Orders", value: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length, icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Products", value: products.length, icon: Package, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Customer Points", value: `${(users.reduce((acc, u) => acc + (u.points || 0), 0) / 1000).toFixed(1)}k`, icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-background space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-heading font-bold text-chocolate dark:text-cream animate-pulse text-lg">
          Initializing Command Center...
        </p>
      </div>
    );
  }

  // Adaptive tick and bar colors for light vs dark mode
  const tickColor = theme === "dark" ? "#e2d2c2" : "#4a3728";
  const barColorActive = theme === "dark" ? "hsl(var(--primary))" : "#4a3728";
  const barColorInactive = theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "#e5e7eb";

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-background text-foreground transition-all duration-300">
      
      {/* ---- BACKDROP SHADOW ON MOBILE SIDEBAR ---- */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ---- LEFT COL: SaaS SIDEBAR ---- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/70 
        flex flex-col transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative shrink-0
      `}>
        {/* Logo and Brand Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-chocolate/10 dark:bg-primary/20 flex items-center justify-center text-chocolate dark:text-cream">
            <WhiffleLogo className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-chocolate dark:text-cream text-lg leading-none">Whiffle</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider">
              Baker Console
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-heading font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-chocolate text-cream shadow-lg shadow-chocolate/25 dark:bg-primary dark:text-primary-foreground dark:shadow-primary/20"
                    : "text-muted-foreground hover:text-chocolate dark:hover:text-cream hover:bg-secondary/40 dark:hover:bg-secondary/20"
                }`}
              >
                <Icon size={18} className={isActive ? "text-cream dark:text-primary-foreground" : "text-muted-foreground/80"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Panel */}
        <div className="p-4 border-t border-border/50 bg-secondary/10 dark:bg-secondary/5 space-y-3 shrink-0">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-card border border-border/50 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-heading uppercase">
                {user.username?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-chocolate dark:text-cream text-xs truncate leading-none mb-1">
                  {user.username}
                </p>
                <span className="text-[9px] text-muted-foreground font-body leading-none capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-card border border-border/50 text-chocolate dark:text-cream hover:bg-secondary/40 dark:hover:bg-secondary/20 transition-all font-heading font-bold text-xs shadow-sm"
              title="Toggle Theme Mode"
            >
              {theme === "light" ? (
                <>
                  <Moon size={14} /> Dark
                </>
              ) : (
                <>
                  <Sun size={14} /> Light
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all font-heading font-bold text-xs border border-rose-500/20 shadow-sm"
              title="Sign Out"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ---- RIGHT COL: WORKSPACE & CONTENT ---- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-secondary/15 dark:bg-background/40">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-card border-b border-border/50 px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-chocolate dark:text-cream hover:bg-secondary/40"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-chocolate dark:text-cream capitalize">
                {activeTab === "products" ? "Inventory" : activeTab}
              </h1>
              <p className="text-xs text-muted-foreground font-body">
                {format(currentDateTime, "eeee, MMMM dd, yyyy • h:mm:ss a")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData}
              className="p-3 rounded-2xl bg-card border border-border/80 text-chocolate dark:text-cream hover:bg-secondary/40 dark:hover:bg-secondary/20 transition-all shadow-sm"
              title="Sync Storefront Data"
            >
              <RefreshCcw size={16} />
            </button>
            <button 
              onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-chocolate dark:bg-primary text-cream dark:text-primary-foreground px-5 py-3 rounded-2xl font-heading font-bold hover:opacity-90 transition-all shadow-xl shadow-chocolate/10 dark:shadow-primary/10 text-sm"
            >
              <Plus size={18} /> New Product
            </button>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* Stats Summary Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flourish-border relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="text-emerald-500 flex items-center gap-1 text-[10px] font-bold font-heading">
                    +12.5% <ArrowUpRight size={12} />
                  </div>
                </div>
                <p className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-heading font-bold text-chocolate dark:text-cream">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Active Panel Workspace View */}
          <Tabs value={activeTab} className="w-full">
            
            {/* 1. OVERVIEW VIEW */}
            <TabsContent value="overview" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales performance chart */}
                <div className="bg-card p-8 rounded-[2.5rem] border border-border flourish-border shadow-sm">
                  <h3 className="font-heading text-lg font-bold text-chocolate dark:text-cream mb-6 flex items-center gap-2">
                    <TrendingUp className="text-primary" size={18} /> Sales Performance
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "#f0f0f0"} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: tickColor, fontSize: 10, fontWeight: 'bold' }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: tickColor, fontSize: 10 }}
                        />
                        <Tooltip 
                          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(74, 55, 40, 0.05)" }}
                          contentStyle={{ 
                            borderRadius: '1rem', 
                            border: '1px solid hsl(var(--border))', 
                            backgroundColor: 'hsl(var(--card))',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                            fontFamily: 'inherit',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Bar 
                          dataKey="sales" 
                          radius={[6, 6, 0, 0]}
                          barSize={32}
                        >
                          {salesData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.sales > 0 ? barColorActive : barColorInactive} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity list */}
                <div className="bg-card p-8 rounded-[2.5rem] border border-border flourish-border shadow-sm">
                  <h3 className="font-heading text-lg font-bold text-chocolate dark:text-cream mb-6 flex items-center gap-2">
                    <Clock className="text-primary" size={18} /> Recent Orders
                  </h3>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center gap-4 py-2.5 border-b border-border/40 last:border-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                          <ShoppingBag size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold text-chocolate dark:text-cream text-sm truncate">
                            New Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(order.created_at), 'h:mm a')} • ${Number(order.total_amount).toFixed(2)}
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider shrink-0">
                          Received
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">No recent orders found</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 2. INVENTORY WORKSPACE */}
            <TabsContent value="products" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search inventory items..." 
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-secondary/10 dark:bg-secondary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all text-sm"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => toast.info("Filter parameters will release with the spring catalogue update!")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border font-heading font-bold text-chocolate dark:text-cream hover:bg-secondary/40 dark:hover:bg-secondary/20 transition-all text-sm"
                    >
                      <Filter size={16} /> Filters
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border/80">
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm px-4">Product Details</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Category</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Price</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Stock Level</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm text-right px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                        <tr key={product.id} className="group hover:bg-secondary/5 dark:hover:bg-secondary/3 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/80 bg-secondary/30 shrink-0">
                                <img 
                                  src={product.image_url || "/placeholder.jpg"} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-body font-bold text-chocolate dark:text-cream text-sm leading-tight truncate">{product.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">#{product.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold border border-primary/10">
                              {product.category?.name || "Uncategorized"}
                            </span>
                          </td>
                          <td className="py-4 font-heading font-bold text-chocolate dark:text-cream text-sm">
                            ${Number(product.price).toFixed(2)}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <span className="font-body text-xs text-chocolate dark:text-cream">{product.stock_quantity} available</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                                className="p-2 rounded-lg bg-card border border-border text-chocolate dark:text-cream hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-primary-foreground transition-all shadow-sm"
                                title="Edit Product details"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 rounded-lg bg-card border border-border text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                title="Remove Product from inventory"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* 3. ORDERS VIEW */}
            <TabsContent value="orders" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border/80">
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm px-4">Order Code</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Customer Info</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Created Date</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Grand Total</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Fulfillment Status</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm text-right px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-secondary/5 dark:hover:bg-secondary/3 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-mono text-xs font-bold text-chocolate dark:text-cream">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-primary/15 dark:bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary font-heading shrink-0">
                                {(order.shipping_address?.full_name || "Guest").split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </div>
                              <p className="font-body font-bold text-chocolate dark:text-cream text-xs truncate max-w-[150px]">
                                {order.shipping_address?.full_name || "Anonymous Customer"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 font-body text-xs text-muted-foreground">
                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                          </td>
                          <td className="py-4 font-heading font-bold text-chocolate dark:text-cream text-sm">
                            ${Number(order.total_amount).toFixed(2)}
                          </td>
                          <td className="py-4">
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className={`
                                px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-border/80 
                                cursor-pointer focus:ring-2 focus:ring-primary/20 focus:outline-none bg-card ${
                                  order.status === 'delivered' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5' :
                                  order.status === 'cancelled' ? 'text-rose-600 dark:text-rose-400 bg-rose-500/5' :
                                  'text-amber-600 dark:text-amber-400 bg-amber-500/5'
                                }
                              `}
                            >
                              {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-card border border-border text-chocolate dark:text-cream hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-primary-foreground transition-all shadow-sm"
                                title="View Delivery Log"
                              >
                                <Truck size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 rounded-lg bg-card border border-border text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                title="Purge Order Details"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* 4. CUSTOMERS VIEW */}
            <TabsContent value="customers" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border/80">
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm px-4">User</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Email Address</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Privilege Role</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm">Loyalty Points</th>
                        <th className="pb-3.5 font-heading font-bold text-chocolate dark:text-cream text-sm px-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-secondary/5 dark:hover:bg-secondary/3 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold shrink-0">
                                {user.username?.[0]?.toUpperCase() || '?'}
                              </div>
                              <span className="font-body font-bold text-chocolate dark:text-cream text-sm">{user.username || 'Anonymous'}</span>
                            </div>
                          </td>
                          <td className="py-4 font-body text-xs text-muted-foreground">{user.email}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 font-heading font-bold text-chocolate dark:text-cream text-sm">
                            {user.points || 0}
                          </td>
                          <td className="py-4 font-body text-xs text-muted-foreground px-4">
                            {format(new Date(user.created_at), 'MMM dd, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* ---- MODALS ---- */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchData}
        product={selectedProduct}
        categories={categories}
      />

      <OrderDetailsModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminDashboard;
