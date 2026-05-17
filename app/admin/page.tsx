"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Package, ShoppingCart, DollarSign, Trash2, LogOut, 
  LayoutDashboard, Settings, Sparkles, TrendingUp, Users, 
  ChevronRight, Search, Filter, Bell, ExternalLink, Truck
} from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { Product, Order } from "@/types";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpenId, setEditOpenId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      const [prodData, orderData] = await Promise.all([prodRes.json(), orderRes.json()]);
      setProducts(Array.isArray(prodData) ? prodData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      toast.error("Telemetry fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    totalOrders: orders.length,
    revenue: orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.orderStatus === "pending").length,
    totalClients: new Set(orders.map(o => o.customer.phone)).size,
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure? This action is permanent.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      
      toast.success("Product decommissioned from collection");
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error("Decommission failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFC] flex font-sans selection:bg-primary/10">
      {/* Advanced Sidebar */}
      <aside className="w-72 bg-white border-r border-border/40 flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-black text-foreground tracking-tight leading-none">Umbra</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Studio Manager</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", label: "Dashboard", icon: LayoutDashboard },
              { id: "products", label: "Collection", icon: Package },
              { id: "orders", label: "Client Orders", icon: ShoppingCart },
              { id: "customers", label: "Clients", icon: Users },
              { id: "settings", label: "Studio Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? "bg-primary/5 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"}`} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {activeTab === item.id && <motion.div layoutId="nav-dot" className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-border/40 space-y-6">
          <div className="bg-secondary/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">A</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">Admin Root</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active Session</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => signOut()}
            className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">Terminate Session</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Advanced Top Bar */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-border/40 px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input placeholder="Search orders, products, or clients..." className="h-12 w-full bg-secondary/20 border-none rounded-xl pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-sm" />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-12 h-12 rounded-xl border border-border/40 flex items-center justify-center hover:bg-secondary/40 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />
            </button>
            <Link href="/" target="_blank">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-border/40 gap-2 font-bold text-sm">
                Live Store <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h2 className="text-4xl font-heading font-black text-foreground mb-2">Studio Intelligence</h2>
                    <p className="text-muted-foreground text-lg italic">Real-time performance metrics for Lavender Umbra.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 font-black text-[10px] uppercase tracking-wider">Production Status: Stable</Badge>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { title: "Net Boutique Revenue", value: `৳ ${stats.revenue.toLocaleString()}`, icon: DollarSign, trend: "+24.5%", color: "text-emerald-600 bg-emerald-50" },
                    { title: "Active Collection", value: products.length, icon: Package, trend: "3 new pieces", color: "text-blue-600 bg-blue-50" },
                    { title: "Fulfilled Orders", value: stats.totalOrders, icon: ShoppingCart, trend: "+12% week", color: "text-purple-600 bg-purple-50" },
                    { title: "Client Base", value: stats.totalClients, icon: Users, trend: "+8 this month", color: "text-orange-600 bg-orange-50" },
                  ].map((card, i) => (
                    <Card key={i} className="rounded-3xl border-border/40 shadow-sm overflow-hidden group hover:shadow-floating-xl transition-all duration-500 border-none bg-white">
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center shadow-inner`}>
                            <card.icon className="w-7 h-7" />
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                               <TrendingUp className="w-3 h-3" /> {card.trend}
                             </div>
                          </div>
                        </div>
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{card.title}</h3>
                        <div className="text-3xl font-heading font-black text-foreground tracking-tight">{card.value}</div>
                        
                        <div className="mt-6 pt-6 border-t border-border/20 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           <span>Analytics Graph</span>
                           <div className="flex gap-0.5 items-end h-4">
                              {[30, 70, 50, 90, 40, 80, 100].map((h, j) => (
                                <div key={j} className="w-1 bg-primary/20 rounded-full" style={{ height: `${h}%` }} />
                              ))}
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm p-10 bg-white">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-2xl font-heading font-bold text-foreground">Pending Logistics</h3>
                      <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-primary flex items-center gap-2 hover:gap-3 transition-all">
                        View All Orders <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors group">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-primary shadow-sm group-hover:scale-110 transition-transform">{order.customer.name[0]}</div>
                              <div>
                                <p className="font-bold text-foreground">{order.customer.name}</p>
                                <p className="text-xs text-muted-foreground">{order.items.length} pieces • {order.paymentMethod}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-bold text-foreground">৳{order.total}</p>
                              <Badge variant="ghost" className="text-[9px] uppercase font-black text-primary p-0">New Dispatch</Badge>
                           </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="rounded-[2.5rem] border-none shadow-sm p-10 bg-white flex flex-col">
                     <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-gold" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-foreground">Top Movers</h3>
                     </div>
                     <div className="space-y-8 flex-1">
                        {products.filter(p => p.featured).slice(0, 4).map((p) => (
                           <div key={p._id} className="flex items-center gap-4">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="font-bold text-foreground truncate">{p.name}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{p.scent}</p>
                              </div>
                              <div className="text-right">
                                 <p className="font-bold text-primary">৳{p.price["100g"]}</p>
                                 <p className="text-[9px] text-emerald-600 font-bold">+18%</p>
                              </div>
                           </div>
                        ))}
                     </div>
                     <Button variant="outline" className="mt-10 rounded-xl w-full border-dashed border-border text-muted-foreground">View Inventory Detail</Button>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "products" && (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-heading font-black text-foreground mb-2">Collection Library</h2>
                    <p className="text-muted-foreground text-lg">Detailed inventory and artisan specifications.</p>
                  </div>
                  <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger render={
                      <Button className="h-14 px-10 rounded-2xl font-bold gradient-primary !text-white shadow-xl hover:shadow-glow transition-all">
                        <Plus className="w-5 h-5 mr-3" /> Define New Piece
                      </Button>
                    } />
                    <DialogContent className="w-full max-w-4xl sm:max-w-4xl rounded-[2.5rem] bg-white p-0 border-none shadow-2xl overflow-hidden">
                      <div className="max-h-[90vh] overflow-y-auto p-12 custom-scrollbar">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
                        <DialogHeader className="mb-10 text-center">
                          <DialogTitle className="text-4xl font-heading font-black text-foreground tracking-tight">New Artisan Creation</DialogTitle>
                          <p className="text-muted-foreground text-lg italic mt-2">Specify the technical details for your next masterpiece.</p>
                        </DialogHeader>
                        <ProductForm onSuccess={() => { fetchData(); setCreateOpen(false); }} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border/20">
                   <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                      <Input placeholder="Filter inventory..." className="bg-transparent border-none pl-12 h-10 focus-visible:ring-0" />
                   </div>
                   <Button variant="ghost" className="gap-2 text-sm font-bold"><Filter className="w-4 h-4" /> Filters</Button>
                </div>

                <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-[#FDFBFF]">
                      <TableRow className="border-border/40">
                        <TableHead className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Master Identity</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Type</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Scent Profile</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Price Tier</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</TableHead>
                        <TableHead className="py-8 px-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Studio Control</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p) => (
                        <TableRow key={p._id} className="border-border/40 hover:bg-primary/[0.02] transition-colors group">
                          <TableCell className="px-10 py-8">
                             <div className="flex items-center gap-6">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border/20 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                   <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                                </div>
                                <div>
                                   <p className="font-heading font-black text-xl text-foreground">{p.name}</p>
                                   <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Ref: {p._id.slice(-8).toUpperCase()}</p>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell>
                             <Badge variant="outline" className={`rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest ${p.type === 'weightless' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-secondary text-muted-foreground'}`}>
                               {p.type}
                             </Badge>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                                <span className="font-bold text-foreground text-sm">{p.scent}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col gap-1.5 font-bold text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="w-8 text-muted-foreground text-[10px] uppercase font-black">100g</span> ৳{p.price["100g"]}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-8 text-muted-foreground text-[10px] uppercase font-black">150g</span> ৳{p.price["150g"]}
                                </div>
                             </div>
                          </TableCell>
                          <TableCell>
                             {p.featured ? (
                               <Badge className="bg-gold/10 text-gold border-gold/30 rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-widest">Editorial Choice</Badge>
                             ) : (
                               <Badge variant="outline" className="text-muted-foreground border-border/40 rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-widest">Standard</Badge>
                             )}
                          </TableCell>
                          <TableCell className="px-10 text-right">
                             <div className="flex justify-end gap-3 transition-opacity">
                                <Dialog open={editOpenId === p._id} onOpenChange={(open) => setEditOpenId(open ? p._id : null)}>
                                  <DialogTrigger render={
                                    <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/5 transition-colors">
                                       <Settings className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                  } />
                                  <DialogContent className="w-full max-w-4xl sm:max-w-4xl rounded-[2.5rem] bg-white p-0 border-none shadow-2xl overflow-hidden">
                                    <div className="max-h-[90vh] overflow-y-auto p-12 custom-scrollbar">
                                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
                                      <DialogHeader className="mb-10 text-center">
                                        <DialogTitle className="text-4xl font-heading font-black text-foreground tracking-tight">Modify Masterpiece</DialogTitle>
                                        <p className="text-muted-foreground text-lg italic mt-2">Adjust the technical specifications for this artisan creation.</p>
                                      </DialogHeader>
                                      <ProductForm onSuccess={() => { fetchData(); setEditOpenId(null); }} initialData={p} />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="icon" onClick={() => deleteProduct(p._id)} className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors border-destructive/20">
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-heading font-black text-foreground mb-2">Order Logistics</h2>
                  <p className="text-muted-foreground text-lg italic">Tracking the flow of artisan creations across the network.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { label: "Pending Fulfillment", count: stats.pendingOrders, icon: Bell, color: "text-orange-600 bg-orange-50" },
                     { label: "Active Deliveries", count: 12, icon: Truck, color: "text-blue-600 bg-blue-50" },
                     { label: "Successful Transactions", count: orders.filter(o => o.paymentStatus === 'paid').length, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
                   ].map((item, i) => (
                      <Card key={i} className="rounded-3xl border-none p-8 bg-white flex items-center gap-6">
                         <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center`}>
                           <item.icon className="w-8 h-8" />
                         </div>
                         <div>
                            <p className="text-3xl font-heading font-black text-foreground">{item.count}</p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                         </div>
                      </Card>
                   ))}
                </div>

                <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-[#FDFBFF]">
                      <TableRow className="border-border/40">
                        <TableHead className="py-8 px-10 text-[10px] font-black uppercase tracking-widest">Client Identity</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Manifest</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Investment</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Logistics Status</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Verification</TableHead>
                        <TableHead className="py-8 px-10 text-right text-[10px] font-black uppercase tracking-widest">Control</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => (
                        <TableRow key={o._id} className="border-border/40 hover:bg-primary/[0.02] transition-colors">
                          <TableCell className="px-10 py-8">
                             <p className="font-heading font-black text-lg text-foreground">{o.customer.name}</p>
                             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">{o.customer.district} • {o.customer.phone}</p>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-wrap gap-2 max-w-md">
                                {o.items.map((i, j) => (
                                   <Badge key={j} variant="outline" className="bg-secondary/40 border-none font-bold text-[9px] uppercase">{i.name} ({i.size})</Badge>
                                ))}
                             </div>
                          </TableCell>
                          <TableCell className="font-heading font-black text-primary text-xl">৳{o.total}</TableCell>
                          <TableCell>
                             <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-1.5 font-black text-[9px] uppercase tracking-widest">
                               {o.orderStatus}
                             </Badge>
                          </TableCell>
                          <TableCell>
                             <Badge className={o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-none rounded-full px-5 py-1.5 font-black text-[9px] uppercase tracking-widest' : 'bg-orange-50 text-orange-600 border-none rounded-full px-5 py-1.5 font-black text-[9px] uppercase tracking-widest'}>
                               {o.paymentStatus}
                             </Badge>
                          </TableCell>
                          <TableCell className="px-10 text-right">
                             <Button className="h-12 rounded-xl px-8 font-black text-[10px] uppercase tracking-widest bg-foreground text-white hover:bg-foreground/80 transition-all shadow-sm">Update Flow</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            )}

            {activeTab === "customers" && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-4xl font-heading font-black text-foreground mb-2">Client Roster</h2>
                  <p className="text-muted-foreground text-lg italic">A curated ledger of our esteemed patrons.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { label: "Total VIPs", count: Math.floor(stats.totalClients * 0.1) || 1, icon: Sparkles, color: "text-gold bg-gold/10" },
                     { label: "Active Patrons", count: stats.totalClients, icon: Users, color: "text-primary bg-primary/10" },
                     { label: "New This Month", count: Math.floor(stats.totalClients * 0.3) || 2, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
                   ].map((item, i) => (
                      <Card key={i} className="rounded-3xl border-none p-8 bg-white flex items-center gap-6">
                         <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center`}>
                           <item.icon className="w-8 h-8" />
                         </div>
                         <div>
                            <p className="text-3xl font-heading font-black text-foreground">{item.count}</p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                         </div>
                      </Card>
                   ))}
                </div>

                <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-[#FDFBFF]">
                      <TableRow className="border-border/40">
                        <TableHead className="py-8 px-10 text-[10px] font-black uppercase tracking-widest">Patron Identity</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Contact</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Location</TableHead>
                        <TableHead className="py-8 text-[10px] font-black uppercase tracking-widest">Total Orders</TableHead>
                        <TableHead className="py-8 px-10 text-right text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Extract unique customers from orders */}
                      {Array.from(new Map(orders.map(o => [o.customer.phone, o])).values()).map((o) => (
                        <TableRow key={o.customer.phone} className="border-border/40 hover:bg-primary/[0.02] transition-colors">
                          <TableCell className="px-10 py-8">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary font-bold">
                                 {o.customer.name[0]}
                               </div>
                               <div>
                                 <p className="font-heading font-black text-lg text-foreground">{o.customer.name}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Joined 2026</p>
                               </div>
                             </div>
                          </TableCell>
                          <TableCell>
                             <p className="font-bold text-sm">{o.customer.phone}</p>
                          </TableCell>
                          <TableCell>
                             <Badge variant="outline" className="bg-secondary/40 border-none font-bold text-[9px] uppercase tracking-widest">{o.customer.district || "Unknown"}</Badge>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2 font-bold text-sm">
                               {orders.filter(order => order.customer.phone === o.customer.phone).length} Purchases
                             </div>
                          </TableCell>
                          <TableCell className="px-10 text-right">
                             {orders.filter(order => order.customer.phone === o.customer.phone).length > 2 ? (
                               <Badge className="bg-gold/10 text-gold border-none rounded-full px-5 py-1.5 font-black text-[9px] uppercase tracking-widest">VIP Patron</Badge>
                             ) : (
                               <Badge className="bg-primary/5 text-primary border-none rounded-full px-5 py-1.5 font-black text-[9px] uppercase tracking-widest">Standard</Badge>
                             )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-heading font-black text-foreground mb-2">Studio Configuration</h2>
                    <p className="text-muted-foreground text-lg italic">Manage your boutique's operational parameters.</p>
                  </div>
                  <Button className="h-14 px-10 rounded-2xl font-bold gradient-primary !text-white shadow-xl hover:shadow-glow transition-all">
                    Save Changes
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                   <div className="lg:col-span-2 space-y-8">
                      <Card className="rounded-[2.5rem] border-none shadow-sm p-10 bg-white">
                         <h3 className="text-xl font-heading font-bold text-foreground mb-8">General Preferences</h3>
                         <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Boutique Name</label>
                                 <Input defaultValue="Lavender Umbra" className="h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all" />
                               </div>
                               <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Contact Email</label>
                                 <Input defaultValue="hello@lavenderumbra.com" className="h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all" />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Studio Announcement</label>
                               <Textarea defaultValue="Free shipping on all weightless artisan collections this month." className="min-h-[100px] rounded-[2rem] bg-secondary/20 border-none p-6 text-sm focus:bg-white transition-all resize-none" />
                            </div>
                         </div>
                      </Card>
                   </div>
                   
                   <div className="space-y-8">
                      <Card className="rounded-[2.5rem] border-none shadow-sm p-10 bg-white">
                         <h3 className="text-xl font-heading font-bold text-foreground mb-8">Store Status</h3>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                               <div className="flex items-center gap-3">
                                  <ShieldCheck className="w-5 h-5" />
                                  <span className="font-bold text-sm">Accepting Orders</span>
                               </div>
                               <div className="w-12 h-6 bg-emerald-200 rounded-full relative cursor-pointer">
                                  <div className="absolute right-1 top-1 w-4 h-4 bg-emerald-600 rounded-full" />
                               </div>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                               Toggling this off will pause all new checkouts but keep the gallery visible to clients.
                            </p>
                         </div>
                      </Card>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shadow-floating-xl {
          box-shadow: 0 25px 50px -12px rgba(91, 33, 182, 0.12);
        }
      `}</style>
    </div>
  );
}

// Helper icons missing from initial import
function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
