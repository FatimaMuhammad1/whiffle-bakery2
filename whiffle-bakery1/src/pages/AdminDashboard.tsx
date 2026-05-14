import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  Filter,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Truck
} from "lucide-react";
import { api, type BackendProduct, type BackendOrder, type BackendUser } from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toFrontendProduct } from "@/lib/productAdapter";
import ProductModal from "@/components/ProductModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";

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
  // ... existing state ...
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

  // ... existing effects ...

  // ... rest of component ...


  // Security: Prevent search engine indexing
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
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

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: "Total Revenue", value: `$${orders.reduce((acc, o) => acc + Number(o.total_amount), 0).toFixed(2)}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Orders", value: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length, icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Products", value: products.length, icon: Package, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Customer Points", value: "24.5k", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-heading font-bold text-chocolate animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="font-heading text-4xl font-bold text-chocolate dark:text-cream mb-1">Baker Dashboard</h1>
            <p className="font-body text-muted-foreground">Manage your artisan storefront and logistics</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchData}
              className="p-3 rounded-2xl bg-white border border-border text-chocolate hover:bg-secondary/50 transition-all shadow-sm"
            >
              <RefreshCcw size={20} />
            </button>
            <button 
              onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-chocolate text-cream px-6 py-3 rounded-2xl font-heading font-bold hover:opacity-90 transition-all shadow-xl shadow-chocolate/20"
            >
              <Plus size={20} /> New Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[2.5rem] border border-border shadow-sm flourish-border">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-emerald-500 flex items-center gap-1 text-xs font-bold font-heading">
                  +12.5% <ArrowUpRight size={14} />
                </div>
              </div>
              <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-heading font-bold text-chocolate">{stat.value}</h3>
            </div>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-8">
          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-white inline-flex shadow-sm mb-4">
            <TabsList className="bg-transparent border-0 gap-2">
              <TabsTrigger 
                value="overview" 
                className="rounded-[1.5rem] px-8 py-3 data-[state=active]:bg-chocolate data-[state=active]:text-cream font-heading font-bold text-chocolate transition-all"
              >
                <LayoutDashboard size={18} className="mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="rounded-[1.5rem] px-8 py-3 data-[state=active]:bg-chocolate data-[state=active]:text-cream font-heading font-bold text-chocolate transition-all"
              >
                <Package size={18} className="mr-2" /> Inventory
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="rounded-[1.5rem] px-8 py-3 data-[state=active]:bg-chocolate data-[state=active]:text-cream font-heading font-bold text-chocolate transition-all"
              >
                <ShoppingBag size={18} className="mr-2" /> Orders
              </TabsTrigger>
              <TabsTrigger 
                value="customers" 
                className="rounded-[1.5rem] px-8 py-3 data-[state=active]:bg-chocolate data-[state=active]:text-cream font-heading font-bold text-chocolate transition-all"
              >
                <Users size={18} className="mr-2" /> Customers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] border border-border flourish-border shadow-sm">
                   <h3 className="font-heading text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
                     <TrendingUp className="text-primary" /> Sales Performance
                   </h3>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4a3728', fontSize: 10, fontWeight: 'bold' }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4a3728', fontSize: 10 }}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(74, 55, 40, 0.05)' }}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
                          />
                          <Bar 
                            dataKey="sales" 
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                          >
                            {salesData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.sales > 0 ? '#4a3728' : '#e5e7eb'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="bg-white p-8 rounded-[3rem] border border-border flourish-border shadow-sm">
                   <h3 className="font-heading text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
                     <Clock className="text-primary" /> Recent Activity
                   </h3>
                   <div className="space-y-6">
                      {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex items-center gap-4 py-2 border-b border-border/50 last:border-0">
                           <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                             <ShoppingBag size={18} />
                           </div>
                           <div className="flex-1">
                             <p className="font-body font-bold text-chocolate text-sm">New Order #{order.id.slice(0, 8)}</p>
                             <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), 'h:mm a')} • ${order.total_amount}</p>
                           </div>
                           <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-tighter">
                             Received
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-[3rem] border border-border shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <button 
                     onClick={() => toast.info("Advanced filtering coming in the next update!")}
                     className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-border font-heading font-bold text-chocolate hover:bg-secondary transition-all"
                   >
                     <Filter size={18} /> Filters
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-4 font-heading font-bold text-chocolate text-sm px-4">Product</th>
                      <th className="pb-4 font-heading font-bold text-chocolate text-sm">Category</th>
                      <th className="pb-4 font-heading font-bold text-chocolate text-sm">Price</th>
                      <th className="pb-4 font-heading font-bold text-chocolate text-sm">Stock</th>
                      <th className="pb-4 font-heading font-bold text-chocolate text-sm text-right px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
                      <tr key={product.id} className="group hover:bg-secondary/10 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-secondary/30">
                              <img 
                                src={product.image_url || "/placeholder.jpg"} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-body font-bold text-chocolate text-sm leading-tight">{product.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono uppercase">#{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-bold">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-4 font-heading font-bold text-chocolate">${Number(product.price).toFixed(2)}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                             <span className="font-body text-sm text-chocolate">{product.stock_quantity} in stock</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                              className="p-2 rounded-lg bg-white border border-border text-chocolate hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-lg bg-white border border-border text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
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

          <TabsContent value="orders" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-6 rounded-[3rem] border border-border shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm px-4">Order ID</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Customer</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Date</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Amount</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Status</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm text-right px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-secondary/10 transition-colors">
                          <td className="py-5 px-4">
                            <p className="font-mono text-xs font-bold text-chocolate">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </td>
                          <td className="py-5">
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                 {order.shipping_address?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                               </div>
                               <p className="font-body text-sm text-chocolate">{order.shipping_address?.full_name}</p>
                             </div>
                          </td>
                          <td className="py-5 font-body text-xs text-muted-foreground">{format(new Date(order.created_at), 'MMM dd, yyyy')}</td>
                          <td className="py-5 font-heading font-bold text-chocolate text-sm">${Number(order.total_amount).toFixed(2)}</td>
                          <td className="py-5">
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-0 cursor-pointer focus:ring-2 focus:ring-primary/20 ${
                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                                order.status === 'cancelled' ? 'bg-rose-50 text-rose-600' :
                                'bg-amber-50 text-amber-600'
                              }`}
                            >
                              {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-5 px-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsOrderModalOpen(true);
                                  }}
                                  className="p-2 rounded-lg bg-white border border-border text-chocolate hover:bg-primary hover:text-white transition-all shadow-sm"
                                  title="View Details"
                                >
                                  <Truck size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-2 rounded-lg bg-white border border-border text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                  title="Delete Order"
                                >
                                  <Trash2 size={16} />
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

           <TabsContent value="customers" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-6 rounded-[3rem] border border-border shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm px-4">User</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Email</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Role</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Points</th>
                        <th className="pb-4 font-heading font-bold text-chocolate text-sm">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="py-4 px-4">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                                   {user.username?.[0]?.toUpperCase() || '?'}
                                 </div>
                                 <span className="font-body font-bold text-chocolate">{user.username || 'Anonymous'}</span>
                             </div>
                          </td>
                          <td className="py-4 font-body text-sm text-muted-foreground">{user.email}</td>
                          <td className="py-4">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}`}>
                               {user.role}
                             </span>
                          </td>
                          <td className="py-4 font-heading font-bold text-chocolate">{user.points}</td>
                          <td className="py-4 font-body text-xs text-muted-foreground">{format(new Date(user.created_at), 'MMM dd, yyyy')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>

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
