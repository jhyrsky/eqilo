"use client";

import { useEffect, useState } from "react";
import { Order } from "@/lib/types/firestore";
import { getUserOrders } from "@/lib/actions/orders";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ExternalLink,
  MapPin,
  FileDown,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";
import { useRouter } from "next/navigation";
import { createCustomerPortalSession } from "@/lib/actions/billing";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";

const statuses = [
  { id: 'paid', label: 'orders.paid', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'processing', label: 'orders.processing', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'shipped', label: 'orders.shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'delivered', label: 'orders.delivered', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await getUserOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleBillingPortal = async () => {
    if (!user) return;
    setIsBillingLoading(true);
    try {
      const result = await createCustomerPortalSession(user.uid);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(t("error.description") || "Failed to open billing portal.");
      }
    } catch (e) {
      console.error("Billing Portal Error:", e);
      alert(t("error.description") || "Failed to open billing portal.");
    } finally {
      setIsBillingLoading(false);
    }
  };

  const handleReorder = async (order: Order) => {
    for (const item of order.items) {
      await addItem(item.product_id, item.quantity);
    }
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground animate-pulse font-medium">{t("orders.loading")}</p>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{t("nav.my_orders")}</h1>
          <p className="text-muted-foreground">{t("orders.description")}</p>
        </div>
        {!loading && orders.length > 0 && (
          <Button
            variant="outline"
            onClick={handleBillingPortal}
            disabled={isBillingLoading}
            className="font-bold border-primary/20 hover:bg-primary/5 shadow-sm"
          >
            {isBillingLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {t("orders.manage_billing")}
          </Button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl bg-muted/10">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-bold mb-2">{t("orders.empty")}</h2>
          <p className="text-muted-foreground mb-6">{t("orders.empty_sub")}</p>
          <Link href="/shop">
             <Button>{t("cart.browse")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatusIndex = statuses.findIndex(s => s.id === order.status);
            
            return (
              <Card key={order.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="bg-muted/30 border-b border-border/50 px-6 py-4 flex flex-row items-center justify-between">
                  <div className="flex gap-6">
                     <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("orders.id")}</p>
                       <p className="text-sm font-mono font-bold">#{order.id.substring(0, 8)}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("orders.date")}</p>
                       {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                       <p className="text-sm font-bold">{new Date(order.created_at as any).toLocaleDateString()}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("cart.total")}</p>
                       <p className="text-sm font-bold text-primary">{formatPrice(order.total_amount)} €</p>
                     </div>
                  </div>
                  <Badge variant="outline" className={cn("font-bold uppercase tracking-wider px-3 py-1", 
                    order.status === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                    order.status === 'shipped' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                    'border-amber-200 bg-amber-50 text-amber-700'
                  )}>
                    {t(statuses.find(s => s.id === order.status)?.label || order.status)}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Status Timeline */}
                  <div className="relative flex justify-between mb-10 mt-4 px-4 sm:px-10">
                    <div className="absolute top-5 left-10 right-10 h-0.5 bg-muted -z-10">
                       <div 
                         className="h-full bg-primary transition-all duration-500" 
                         style={{ width: `${Math.max(0, currentStatusIndex) / (statuses.length - 1) * 100}%` }}
                       />
                    </div>
                    {statuses.map((s, idx) => {
                      const isActive = idx <= currentStatusIndex;
                      const Icon = s.icon;
                      return (
                        <div key={s.id} className="flex flex-col items-center gap-2 relative">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            isActive ? "bg-primary border-primary text-white shadow-md scale-110" : "bg-background border-muted text-muted-foreground"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-tight absolute -bottom-6 whitespace-nowrap",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}>
                            {t(s.label)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-6 border-t mt-10">
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">{t("orders.items")}</h4>
                      <div className="space-y-3">
                         {order.items.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-sm font-medium">
                              <span className="text-muted-foreground">{item.quantity}x <span className="text-foreground">{t("orders.product_id")}: {item.product_id.substring(0, 10)}...</span></span>
                              <span>{formatPrice(item.price * item.quantity)} €</span>
                           </div>
                         ))}
                      </div>
                      
                      {order.tax_breakdown && order.tax_breakdown.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-dashed">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("orders.tax_breakdown")}</p>
                          {order.tax_breakdown.map((tax, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-medium">
                               <span className="text-muted-foreground">{tax.label}</span>
                               <span>{formatPrice(tax.amount)} €</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">{t("orders.delivery_details")}</h4>
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-sm">
                           <p className="font-bold">{order.shipping_address.line1}</p>
                           <p className="text-muted-foreground">{order.shipping_address.postal_code} {order.shipping_address.city}, {order.shipping_address.country}</p>
                        </div>
                      </div>
                      
                      {order.tracking_number && (
                        <div className="mt-4 pt-4 border-t">
                           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{t("orders.tracking")}</p>
                           <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/10">
                              <div className="flex items-center gap-3">
                                 <Truck className="w-5 h-5 text-primary" />
                                 <div>
                                   <p className="text-xs font-bold text-primary">{order.courier || 'Global Shipping'}</p>
                                   <p className="text-sm font-mono font-medium">{order.tracking_number}</p>
                                 </div>
                              </div>
                              {order.tracking_url && (
                                <a href={order.tracking_url} target="_blank" rel="noreferrer">
                                  <Button size="sm" variant="ghost" className="h-8 gap-2 font-bold">
                                     {t("orders.track_button")} <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </a>
                              )}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {order.stripe_invoice_pdf ? (
                      <a href={order.stripe_invoice_pdf} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto font-bold">
                          <FileDown className="w-4 h-4 mr-2" />
                          {t("orders.download_invoice")}
                        </Button>
                      </a>
                    ) : (
                      <div className="text-xs text-muted-foreground italic flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {t("orders.invoice_processing")}
                      </div>
                    )}
                    <Button 
                      className="w-full sm:w-auto font-bold"
                      onClick={() => handleReorder(order)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {t("orders.reorder")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
