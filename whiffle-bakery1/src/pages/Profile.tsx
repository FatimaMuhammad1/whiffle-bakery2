import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { api, type BackendOrder, type BackendReminder } from "@/lib/api";
import { 
  Package, 
  Settings, 
  LogOut, 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  CreditCard,
  Heart,
  Bell,
  ArrowRight,
  Sparkles,
  Plus,
  Loader2,
  CircleCheckBig,
  MapPin,
  Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import heroBg from "@/assets/hero-bakery.jpg";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const { totalItems: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [reminders, setReminders] = useState<BackendReminder[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ---- Edit Profile State ----
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editFullName, setEditFullName] = useState(user?.full_name || "");
  const [editAddress, setEditAddress] = useState(user?.address || "");
  const [editCity, setEditCity] = useState(user?.city || "");
  const [editZip, setEditZip] = useState(user?.zip || "");
  const [updating, setUpdating] = useState(false);
  
  // ---- Reminder State ----
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [creatingReminder, setCreatingReminder] = useState(false);
  
  // ---- Order Details State ----
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // ---- Notified Reminders State ----
  const [notifiedReminders, setNotifiedReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, remindersData, wishlistData] = await Promise.all([
          api.getOrders(),
          api.getReminders(),
          api.getWishlist()
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setReminders(Array.isArray(remindersData) ? remindersData.filter(r => !r.is_completed) : []);
        setWishlistItems(Array.isArray(wishlistData) ? wishlistData : []);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // ---- Reminder Checker ----
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.is_completed && !notifiedReminders.has(reminder.id)) {
          const remindTime = new Date(reminder.remind_at);
          if (now >= remindTime) {
            toast('Baking Reminder', {
              description: reminder.title,
              icon: <Bell className="text-primary" />,
            });
            setNotifiedReminders(prev => new Set(prev).add(reminder.id));
          }
        }
      });
    }, 1000); // Check every 1 second
    
    return () => clearInterval(interval);
  }, [reminders, notifiedReminders]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteMe();
      await logout();
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const navigate = useNavigate();
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await api.updateMe({ 
        username: editUsername, 
        email: editEmail,
        full_name: editFullName,
        address: editAddress,
        city: editCity,
        zip: editZip
      });
      
      if (response.verification_required) {
        toast.success(response.message);
        navigate(`/verify-otp?email=${encodeURIComponent(editEmail)}`);
        return;
      }

      await refreshUser();
      setIsEditing(false);
      toast.success(response.message || "Profile updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      await api.updateMe({ two_factor_enabled: enabled });
      await refreshUser();
      toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error("Failed to update 2FA settings");
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle || !reminderDate) return;
    
    setCreatingReminder(true);
    try {
      const newReminder = await api.createReminder({
        title: reminderTitle,
        remind_at: new Date(reminderDate).toISOString()
      });
      setReminders(prev => [...prev, newReminder]);
      setReminderTitle("");
      setReminderDate("");
      setShowReminderForm(false);
      toast.success("Reminder added!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create reminder";
      toast.error(message);
    } finally {
      setCreatingReminder(false);
    }
  };

  const toggleReminder = async (id: string, currentStatus: boolean) => {
    // Optimistically update to show the checkmark immediately
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_completed: !currentStatus } : r));
    
    try {
      await api.updateReminder(id, { is_completed: !currentStatus });
      
      // If marking as done, make it disappear after a short delay
      if (!currentStatus) {
        setTimeout(() => {
          setReminders(prev => prev.filter(r => r.id !== id));
        }, 500); // 500ms lets the user see the checkmark and strikethrough before it vanishes
      }
    } catch (error) {
      // Revert if API fails
      setReminders(prev => prev.map(r => r.id === id ? { ...r, is_completed: currentStatus } : r));
      toast.error("Failed to update reminder");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20';
      case 'cancelled': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20';
      default: return 'text-primary bg-primary/5 border-primary/10';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      
      {/* ---- Edit Profile Overlay ---- */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-chocolate/40 backdrop-blur-md" onClick={() => !updating && setIsEditing(false)} />
          <div className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 flourish-border">
            <div className="relative z-10">
              <h2 className="text-3xl font-heading font-bold mb-6 text-chocolate dark:text-cream">Edit Profile</h2>
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Username</label>
                  <input 
                    type="text" 
                    value={editUsername} 
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editFullName} 
                      onChange={e => setEditFullName(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Default Address</label>
                    <input 
                      type="text" 
                      value={editAddress} 
                      onChange={e => setEditAddress(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">City</label>
                    <input 
                      type="text" 
                      value={editCity} 
                      onChange={e => setEditCity(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">ZIP</label>
                    <input 
                      type="text" 
                      value={editZip} 
                      onChange={e => setEditZip(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-body transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    disabled={updating}
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3.5 rounded-2xl border border-border font-body font-bold hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-heading font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---- Premium Header Section ---- */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <img 
          src={heroBg} 
          alt="Profile Cover" 
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Banner Flourish */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 flex flex-col items-center text-center">
          <div className="eyebrow mb-4 bg-white/20 border-white/30 text-white backdrop-blur-md">Your Baking Dashboard</div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white drop-shadow-xl">
            Welcome back, <span className="italic text-primary-foreground">{user.username}</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-24 relative z-10">
        
        {/* ---- Profile Identity Card ---- */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[3rem] p-8 md:p-10 shadow-2xl mb-12 flex flex-col md:flex-row items-center md:items-end gap-8 flourish-border">
          <div className="relative group z-10">
            <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-primary/20 to-primary/40 p-1 backdrop-blur-md border border-primary/30 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-cream dark:bg-chocolate flex items-center justify-center text-6xl font-heading font-bold text-primary">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-4 border-card flex items-center justify-center shadow-lg">
              <CircleCheckBig size={20} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left z-10 pb-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
              <h2 className="text-4xl font-heading font-bold text-chocolate dark:text-cream tracking-tight">{user.username}</h2>
              {user.is_verified ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                  <ShieldCheck size={12} /> Certified Baker
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
                  <AlertCircle size={12} /> Email Unverified
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-muted-foreground font-body text-sm font-semibold">
              <span className="flex items-center gap-2"><Mail size={16} className="text-primary/70" /> {user.email}</span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-primary/70" /> 
                Since {user.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'Joined Recently'}
              </span>
              {!user.is_verified && (
                <button 
                  onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(user.email)}`)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
                >
                  Verify Now
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-4 z-10">
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 rounded-2xl bg-secondary/50 border border-border text-chocolate dark:text-cream hover:bg-secondary transition-all shadow-sm active:scale-95 font-heading font-bold flex items-center gap-2"
            >
              <Settings size={18} /> Edit
            </button>
            <button 
              onClick={handleLogout}
              className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 transition-all shadow-sm active:scale-95"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ---- Left: Main Content (Tabs) ---- */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-secondary/30 backdrop-blur-md p-1 border border-border w-full md:w-auto justify-start gap-1 rounded-2xl mb-8">
                {[
                  { value: "overview", label: "Overview", icon: User },
                  { value: "orders", label: "My Orders", icon: ShoppingBag },
                  { value: "wishlist", label: "Wishlist", icon: Heart },
                  { value: "security", label: "Security", icon: Fingerprint },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 font-heading text-sm font-bold transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md border border-transparent data-[state=active]:border-border"
                  >
                    <tab.icon size={16} /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: "Baker Points", value: user.points?.toLocaleString() ?? "0", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Wishlist Items", value: wishlistCount, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group flourish-border">
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon size={24} strokeWidth={2.5} />
                        </div>
                        <div className="text-3xl font-heading font-bold text-chocolate dark:text-cream mb-1">{stat.value}</div>
                        <div className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                        {stat.label === "Total Orders" && (
                          <button 
                            onClick={() => setActiveTab("orders")}
                            className="text-[10px] font-heading font-bold text-primary hover:opacity-70 flex items-center gap-1 uppercase tracking-[0.2em] transition-opacity"
                          >
                            View All <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm flourish-border">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-heading font-bold text-chocolate dark:text-cream flex items-center gap-3">
                        <Clock size={22} className="text-primary" /> Recent History
                      </h3>
                      <button 
                        onClick={() => setActiveTab("orders")}
                        className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group"
                      >
                        View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center justify-between p-5 bg-card hover:bg-secondary/40 border border-border/40 rounded-3xl transition-all cursor-pointer group active:scale-[0.98]"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center text-chocolate dark:text-cream shadow-sm border border-border/50 group-hover:scale-105 transition-transform">
                                <Package size={20} />
                              </div>
                              <div>
                                <p className="font-heading font-bold text-base text-chocolate dark:text-cream mb-0.5">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                <p className="text-[11px] font-body text-muted-foreground font-semibold flex items-center gap-2">
                                  {order.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy') : 'Recently'}
                                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                  <span className={cn(
                                    "capitalize",
                                    order.status === 'completed' ? "text-green-600" : "text-amber-600"
                                  )}>{order.status}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="font-heading font-bold text-xl text-chocolate dark:text-cream">${Number(order.total_amount || 0).toFixed(2)}</span>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 text-muted-foreground transition-colors">
                                <ChevronRight size={18} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center space-y-4">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                          <ShoppingBag size={32} />
                        </div>
                        <p className="text-sm font-body text-muted-foreground italic">No orders found in your oven yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-28 bg-card border border-border rounded-[2rem] animate-pulse" />)}
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-card border border-border rounded-[2.5rem] p-6 hover:shadow-lg transition-all group flourish-border cursor-pointer active:scale-[0.99]"
                    >
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                            <ShoppingBag size={28} />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-xl text-chocolate dark:text-cream mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted-foreground font-semibold">
                              <span className="flex items-center gap-1.5"><Calendar size={14} /> {order.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy') : 'Recently'}</span>
                              <span className="flex items-center gap-1.5"><CreditCard size={14} /> ${Number(order.total_amount || 0).toFixed(2)}</span>
                              <span className="flex items-center gap-1.5"><MapPin size={14} /> {order.shipping_address?.city || 'Local Delivery'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className={cn(
                            "flex-1 md:flex-none px-5 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2",
                            getStatusColor(order.status)
                          )}>
                            {order.status === 'completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {order.status}
                          </div>
                          <div className="p-3 rounded-2xl bg-secondary/30 group-hover:bg-primary/20 text-chocolate dark:text-cream transition-colors border border-border">
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-card border border-border rounded-[3rem] flourish-border">
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/40">
                        <Package size={48} strokeWidth={1} />
                      </div>
                      <h3 className="font-heading text-3xl font-bold text-chocolate dark:text-cream mb-2">No baking history yet</h3>
                      <p className="font-body text-muted-foreground mb-10 max-w-xs mx-auto">Your first order is waiting! Explore our collection and start your journey.</p>
                      <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-heading font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                        Shop the Collection
                      </button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wishlist" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistItems.map((product) => (
                      <div key={product.id} className="bg-card border border-border rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-md transition-all flourish-border">
                        <div className="relative aspect-square overflow-hidden">
                          <img 
                            src={product.image_url || product.image || "/placeholder.jpg"} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <button 
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                await api.removeFromWishlist(product.id);
                                setWishlistItems(prev => prev.filter(p => p.id !== product.id));
                                toast.success("Removed from wishlist");
                              } catch {
                                toast.error("Failed to remove item");
                              }
                            }}
                            className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="p-6">
                          <Link to={`/product/${product.slug}`} className="font-heading font-bold text-lg text-chocolate dark:text-cream hover:text-primary transition-colors block mb-2">
                            {product.name}
                          </Link>
                          <div className="flex justify-between items-center">
                            <span className="font-heading font-bold text-primary text-xl">${Number(product.price).toFixed(2)}</span>
                            <Link to={`/product/${product.slug}`} className="p-2.5 rounded-xl bg-secondary/50 text-chocolate dark:text-cream hover:bg-primary hover:text-white transition-all">
                              <ShoppingBag size={18} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-card border border-border rounded-[3rem] flourish-border">
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500/30">
                        <Heart size={48} strokeWidth={1} />
                      </div>
                      <h3 className="font-heading text-3xl font-bold text-chocolate dark:text-cream mb-2">Your wishlist is resting</h3>
                      <p className="font-body text-muted-foreground mb-10 max-w-xs mx-auto">Start saving your favorite baking tools and ingredients for later.</p>
                      <Link to="/shop" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-heading font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20 inline-block">
                        Browse the Shop
                      </Link>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="security" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm flourish-border">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-heading font-bold text-chocolate dark:text-cream mb-8 flex items-center gap-3">
                      <Fingerprint size={24} className="text-primary" /> Security & Privacy
                    </h3>
                    
                    <div className="space-y-10">
                      <div className="flex items-center justify-between gap-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 font-heading font-bold text-xl text-chocolate dark:text-cream">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            Two-Factor Authentication
                          </div>
                          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md">
                            Add a robust layer of protection. When enabled, we'll send a unique code to your email every time you log in from a new device.
                          </p>
                        </div>
                        <Switch 
                          checked={user.two_factor_enabled} 
                          onCheckedChange={handleToggle2FA}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>

                      <div className="pt-10 border-t border-border">
                        <div className="flex items-center gap-2 font-heading font-bold text-xl text-rose-600 mb-2">
                          <AlertCircle size={20} />
                          Danger Zone
                        </div>
                        <p className="text-sm text-muted-foreground font-body mb-8">
                          Permanently delete your account and all associated data. This action is irreversible.
                        </p>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-rose-500/5 text-rose-600 hover:bg-rose-500/10 transition-all font-heading font-bold text-sm border border-rose-500/20 shadow-sm active:scale-95">
                              <Trash2 size={18} /> Terminate My Account
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2.5rem] border-border bg-card p-8">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-heading text-3xl font-bold text-rose-900 dark:text-rose-400">Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="font-body text-rose-800/70 dark:text-rose-100/50 text-base leading-relaxed">
                                This will permanently erase your Whiffle profile, order history, and Baker Points. We'll be sad to see you go.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-8 gap-4">
                              <AlertDialogCancel className="rounded-2xl border-border font-body font-bold py-6">Wait, Go Back</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={handleDeleteAccount}
                                className="rounded-2xl bg-rose-600 text-white hover:bg-rose-700 font-heading font-bold py-6 px-8 shadow-lg shadow-rose-600/20"
                              >
                                Yes, Delete Forever
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ---- Right: Sidebar Stats & Reminders ---- */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Baking Reminders Card */}
            <div className="bg-chocolate text-cream rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group border border-chocolate-light">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full -ml-12 -mb-12 blur-2xl opacity-30" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-heading font-bold flex items-center gap-3">
                    <Bell size={22} className="text-primary" /> Baking Reminders
                  </h3>
                  <button 
                    onClick={() => setShowReminderForm(!showReminderForm)}
                    className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                  >
                    {showReminderForm ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  </button>
                </div>

                {showReminderForm && (
                  <form onSubmit={handleCreateReminder} className="mb-8 p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-heading font-bold text-cream/50 uppercase tracking-[0.2em] ml-1">What to remember?</label>
                      <input 
                        type="text" 
                        placeholder="Feed the starter..." 
                        value={reminderTitle}
                        onChange={e => setReminderTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/20"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-heading font-bold text-cream/50 uppercase tracking-[0.2em] ml-1">When?</label>
                      <input 
                        type="datetime-local" 
                        value={reminderDate}
                        onChange={e => setReminderDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={creatingReminder}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-heading font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      {creatingReminder && <Loader2 size={16} className="animate-spin" />}
                      Add to Schedule
                    </button>
                  </form>
                )}

                <div className="space-y-6">
                  {reminders.length > 0 ? (
                    reminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-start gap-4 group/item">
                        <button 
                          onClick={() => toggleReminder(reminder.id, reminder.is_completed)}
                          className={cn(
                            "mt-1 w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center shrink-0",
                            reminder.is_completed 
                              ? "bg-primary border-primary text-white" 
                              : "border-white/20 bg-white/5 hover:border-primary/50"
                          )}
                        >
                          {reminder.is_completed && <CheckCircle2 size={14} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-base font-heading font-bold transition-all",
                            reminder.is_completed ? "text-cream/30 line-through" : "text-cream"
                          )}>
                            {reminder.title}
                          </p>
                          <p className="text-[11px] font-body text-cream/40 font-semibold mt-0.5">
                            {format(new Date(reminder.remind_at), 'MMM dd • h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center border border-dashed border-white/10 rounded-3xl">
                      <p className="text-xs font-body text-cream/30 italic">No upcoming reminders.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Baker Tip Card */}
            <Link to="/blog" className="block bg-card border border-border rounded-[3rem] p-10 shadow-sm relative overflow-hidden group flourish-border cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-chocolate dark:text-cream mb-4 italic">
                  The Master's Note
                </h3>
                <p className="text-sm font-body leading-relaxed text-muted-foreground italic group-hover:text-foreground transition-colors duration-300">
                  "Patience is the secret ingredient. Let your dough rise in a warm, draft-free spot for the best texture and deep, complex flavor."
                </p>
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between group-hover:border-primary/20 transition-colors duration-300">
                  <span className="text-[10px] font-heading font-bold text-primary uppercase tracking-[0.2em]">Weekly Inspiration</span>
                  <ArrowRight size={16} className="text-primary/40 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </div>
            </Link>

          </div>

        </div>
      </div>
      {/* ---- Order Details Dialog ---- */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          {selectedOrder && (
            <div className="bg-background max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="bg-chocolate p-8 text-cream">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-primary hover:bg-primary text-white border-none mb-2 px-3 py-1 text-[10px] uppercase tracking-widest">
                      {selectedOrder.status}
                    </Badge>
                    <DialogTitle className="font-heading text-3xl font-bold">Order Details</DialogTitle>
                    <DialogDescription className="text-cream/60 mt-1">
                      Placed on {format(new Date(selectedOrder.created_at), 'MMMM dd, yyyy')} at {format(new Date(selectedOrder.created_at), 'hh:mm a')}
                    </DialogDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-cream/40 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-bold opacity-80">#{selectedOrder.id.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Items List */}
                <div className="space-y-4">
                  <h4 className="font-heading font-bold text-lg text-chocolate">Items Summary</h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <div className="flex-1">
                          <p className="font-body font-bold text-chocolate">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Quantity: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p>
                        </div>
                        <p className="font-heading font-bold text-chocolate">${Number(item.subtotal).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="font-heading font-bold text-sm text-chocolate flex items-center gap-2">
                      <MapPin size={16} className="text-primary" /> Delivery Address
                    </h4>
                    <div className="bg-secondary/20 p-4 rounded-2xl text-sm font-body text-muted-foreground space-y-1">
                      <p className="font-bold text-chocolate">{selectedOrder.shipping_address?.full_name}</p>
                      <p>{selectedOrder.shipping_address?.address}</p>
                      <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.zip}</p>
                      <p>{selectedOrder.shipping_address?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-heading font-bold text-sm text-chocolate flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" /> Order Notes
                    </h4>
                    <div className="bg-secondary/20 p-4 rounded-2xl text-sm font-body text-muted-foreground italic">
                      {selectedOrder.notes || "No special instructions provided."}
                    </div>
                  </div>
                </div>

                {/* Totals Breakdown */}
                <div className="bg-card border border-border rounded-3xl p-6 space-y-3 shadow-sm">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-chocolate">${Number(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-bold text-chocolate">${Number(selectedOrder.shipping_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-bold text-chocolate">${Number(selectedOrder.tax_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border mt-2">
                    <span className="font-heading font-bold text-xl text-chocolate">Total Amount</span>
                    <span className="font-heading font-bold text-2xl text-primary">${Number(selectedOrder.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;


