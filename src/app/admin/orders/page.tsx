"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "@/lib/actions/admin";
import { Order } from "@/lib/types/firestore";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ExternalLink, Loader2, Package, Search, FileText, Truck, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

import { useMemo } from "react";

type SerializedOrder = Omit<Order, 'created_at'> & { created_at: Date };
type SortKey = "id" | "created_at" | "total_amount" | "status" | "customer" | "items";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
  return dir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-primary" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-primary" />;
}

const STATUS_COLORS: Record<string, string> = {
  pending:    "border-yellow-200 bg-yellow-50 text-yellow-700",
  paid:       "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-purple-200 bg-purple-50 text-purple-700",
  shipped:    "border-orange-200 bg-orange-50 text-orange-700",
  delivered:  "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<SerializedOrder | null>(null);
  const [saving, setSaving] = useState(false);
  const [trackingNum, setTrackingNum] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [courier, setCourier] = useState("");
  const [status, setStatus] = useState<Order['status']>("paid");

  useEffect(() => {
    getOrders().then(data => {
      setOrders(data as SerializedOrder[]);
      setLoading(false);
    });
  }, []);

  function openOrder(order: SerializedOrder) {
    setSelected(order);
    setStatus(order.status || "paid");
    setTrackingNum(order.tracking_number || "");
    setTrackingUrl(order.tracking_url || "");
    setCourier(order.courier || "");
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const res = await updateOrder(selected.id, {
      status,
      tracking_number: trackingNum || undefined,
      tracking_url: trackingUrl || undefined,
      courier: courier || undefined,
    });
    if (res.success) {
      toast.success("Order updated");
      setOrders(prev => prev.map(o => o.id === selected.id
        ? { ...o, status, tracking_number: trackingNum, tracking_url: trackingUrl, courier }
        : o
      ));
      setSelected(prev => prev ? { ...prev, status, tracking_number: trackingNum, tracking_url: trackingUrl, courier } : null);
    } else {
      toast.error(res.error || "Failed to update order");
    }
    setSaving(false);
  }

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir(key === "created_at" ? "desc" : "asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const matches = orders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.user_id?.toLowerCase().includes(q) ||
      o.shipping_address?.city?.toLowerCase().includes(q) ||
      o.shipping_address?.line1?.toLowerCase().includes(q)
    );
    return [...matches].sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortBy === "created_at") {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
      } else if (sortBy === "total_amount") {
        av = a.total_amount || 0;
        bv = b.total_amount || 0;
      } else if (sortBy === "items") {
        av = a.items?.length ?? 0;
        bv = b.items?.length ?? 0;
      } else if (sortBy === "customer") {
        av = (a.shipping_address?.city ?? a.user_id ?? "").toLowerCase();
        bv = (b.shipping_address?.city ?? b.user_id ?? "").toLowerCase();
      } else {
        av = String(a[sortBy] ?? "").toLowerCase();
        bv = String(b[sortBy] ?? "").toLowerCase();
      }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }, [orders, search, sortBy, sortDir]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and shipments.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by ID, email, name…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {(["Order", "Customer", "Date", "Items", "Total", "Status"] as const).map((label) => {
                const key: SortKey | null = label === "Order" ? "id" : label === "Customer" ? "customer" : label === "Date" ? "created_at" : label === "Items" ? "items" : label === "Total" ? "total_amount" : label === "Status" ? "status" : null;
                return (
                  <TableHead key={label}>
                    {key ? (
                      <button className="flex items-center font-bold hover:text-primary transition-colors whitespace-nowrap" onClick={() => handleSort(key)}>
                        {label} <SortIcon active={sortBy === key} dir={sortDir} />
                      </button>
                    ) : (
                      <span className="font-bold">{label}</span>
                    )}
                  </TableHead>
                );
              })}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground font-medium">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(order => (
                <TableRow key={order.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => openOrder(order)}>
                  <TableCell className="font-mono font-bold text-sm">#{order.id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>
                    <p className="font-semibold text-sm">{order.shipping_address?.city || "—"}</p>
                    <p className="text-xs text-muted-foreground font-mono">{order.user_id}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('fi-FI')}
                  </TableCell>
                  <TableCell className="text-sm">{order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}</TableCell>
                  <TableCell className="font-bold text-sm">{formatPrice(order.total_amount || 0)} €</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold ${STATUS_COLORS[order.status] || STATUS_COLORS.paid}`}>
                      {order.status || "paid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="font-bold" onClick={e => { e.stopPropagation(); openOrder(order); }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order detail sheet */}
      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  Order #{selected.id.slice(-6).toUpperCase()}
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold ml-auto ${STATUS_COLORS[selected.status] || STATUS_COLORS.paid}`}>
                    {selected.status || "paid"}
                  </Badge>
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(selected.created_at).toLocaleString('fi-FI')} · Full ID: <span className="font-mono">{selected.id}</span>
                </p>
              </SheetHeader>

              {/* Customer */}
              <section className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Customer</h3>
                <div className="bg-muted/30 rounded-xl p-4 space-y-1 text-sm">
                  <p className="font-mono text-xs text-muted-foreground">UID: {selected.user_id}</p>
                  {selected.stripe_customer_id && (
                    <p className="font-mono text-xs text-muted-foreground">Stripe: {selected.stripe_customer_id}</p>
                  )}
                  <p className="text-muted-foreground pt-1">
                    {selected.shipping_address?.line1}<br />
                    {selected.shipping_address?.line2 && <>{selected.shipping_address.line2}<br /></>}
                    {selected.shipping_address?.postal_code} {selected.shipping_address?.city}<br />
                    {selected.shipping_address?.country}
                  </p>
                </div>
              </section>

              {/* Items */}
              <section className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Items</h3>
                <div className="bg-muted/30 rounded-xl divide-y divide-border/50">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                      <div>
                        <p className="font-bold font-mono text-xs text-muted-foreground">{item.product_id}</p>
                        <p className="font-semibold">× {item.quantity}</p>
                      </div>
                      <p className="font-bold">{formatPrice(item.price * item.quantity)} €</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Totals */}
              <section className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Totals</h3>
                <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{formatPrice(selected.subtotal || 0)} €</span></div>
                  {selected.tax_breakdown?.map((tb, i) => (
                    <div key={i} className="flex justify-between text-xs text-muted-foreground">
                      <span>VAT {tb.rate}% ({tb.label})</span><span>{formatPrice(tb.amount)} €</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-extrabold text-base">
                    <span>Total</span><span>{formatPrice(selected.total_amount || 0)} €</span>
                  </div>
                </div>
              </section>

              {/* Stripe links */}
              {(selected.stripe_hosted_invoice_url || selected.stripe_invoice_pdf) && (
                <section className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Stripe</h3>
                  <div className="flex gap-2">
                    {selected.stripe_hosted_invoice_url && (
                      <a href={selected.stripe_hosted_invoice_url} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm" className="font-bold gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" /> View Invoice
                        </Button>
                      </a>
                    )}
                    {selected.stripe_invoice_pdf && (
                      <a href={selected.stripe_invoice_pdf} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm" className="font-bold gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Invoice PDF
                        </Button>
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Status & Shipping */}
              <section className="mb-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Update Order</h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Status</label>
                  <Select value={status} onValueChange={v => setStatus(v as Order['status'])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(['pending','paid','processing','shipped','delivered'] as const).map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Courier</label>
                  <Input placeholder="e.g. Posti, DHL" value={courier} onChange={e => setCourier(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Tracking Number</label>
                  <Input placeholder="JJFI…" value={trackingNum} onChange={e => setTrackingNum(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Tracking URL</label>
                  <Input placeholder="https://…" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} />
                </div>
                <Button className="w-full font-bold" onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes
                </Button>
              </section>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
