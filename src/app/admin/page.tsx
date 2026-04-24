import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, Activity, CheckCircle2 } from "lucide-react";
import { adminDb } from "@/lib/firebase/admin";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types/firestore";

type RecentOrder = Omit<Order, 'created_at'> & { created_at: Date };

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const [productsSnap, inStockSnap, customersSnap, ordersSnap] = await Promise.all([
    adminDb.collection("products").count().get(),
    adminDb.collection("products").where("inventory_count", ">", 0).count().get(),
    adminDb.collection("customers").count().get(),
    adminDb.collection("orders").orderBy("created_at", "desc").limit(5).get(),
  ]);

  const totalProducts = productsSnap.data().count;
  const inStockProducts = inStockSnap.data().count;
  const inventoryPct = totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 0;
  const totalCustomers = customersSnap.data().count;

  const allOrdersSnap = await adminDb.collection("orders").get();
  const totalOrders = allOrdersSnap.docs.length;
  const totalRevenue = allOrdersSnap.docs.reduce((sum, doc) => sum + (doc.data().total_amount || 0), 0);

  const recentOrders = ordersSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate?.() || new Date()
  })) as RecentOrder[];

  return { totalProducts, totalCustomers, totalOrders, totalRevenue, recentOrders, inventoryPct };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { 
      title: "Total Revenue", 
      value: `€${stats.totalRevenue.toLocaleString('fi-FI', { minimumFractionDigits: 2 })}`, 
      label: "Gross lifetime sales", 
      icon: DollarSign, 
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders, 
      label: "Successful checkouts", 
      icon: ShoppingCart, 
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      title: "Active Catalog", 
      value: stats.totalProducts, 
      label: "FDS Timing devices", 
      icon: Package, 
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    { 
      title: "Customers", 
      value: stats.totalCustomers, 
      label: "Registered accounts", 
      icon: Users, 
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 font-medium">Real-time performance metrics for Eqilo.fi</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-border shadow-sm">
           <Badge variant="outline" className="border-none font-bold text-primary">Last 30 Days</Badge>
           <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><TrendingUp className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight">{card.value}</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                {card.label} <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Orders Section */}
        <Card className="lg:col-span-4 border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm" className="font-bold text-xs">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border/50">
               {stats.recentOrders.length === 0 ? (
                 <div className="p-12 text-center text-muted-foreground font-medium">No recent orders found.</div>
               ) : (
                 stats.recentOrders.map((order) => (
                   <div key={order.id} className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                           <p className="text-xs text-muted-foreground">{order.created_at.toLocaleDateString('fi-FI')} • {order.user_id}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-extrabold text-sm text-foreground">{formatPrice(order.total_amount || 0)} €</p>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold mt-1 border-emerald-200 bg-emerald-50 text-emerald-700">
                           {order.status || 'Paid'}
                        </Badge>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </CardContent>
        </Card>

        {/* System Status / Quick Links */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm">
           <CardHeader>
              <CardTitle className="text-xl font-bold">System Health</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inventory Levels</span>
                    <span className="text-xs font-bold">{stats.inventoryPct}%</span>
                 </div>
                 <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${stats.inventoryPct}%` }}></div>
                 </div>
              </div>

              <div className="flex items-center justify-between">
                 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Status</span>
                 <Badge className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Operational
                 </Badge>
              </div>

              <div className="pt-4 space-y-3">
                 <h4 className="text-sm font-bold text-foreground">Quick Admin Actions</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 font-bold border-border/50 hover:border-primary/50 transition-all">
                       <Package className="w-5 h-5 text-primary" />
                       Add Product
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2 font-bold border-border/50 hover:border-primary/50 transition-all">
                       <Users className="w-5 h-5 text-primary" />
                       Find Customer
                    </Button>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

