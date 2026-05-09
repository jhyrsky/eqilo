"use client";

import { useEffect, useState } from "react";
import { Cart, CartItem } from "@/lib/types/firestore";
import { generateShareableCartLink, updateCartItemPrice } from "@/lib/actions/cart";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Link2, Copy, Check, ShoppingCart, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { getAdminCarts } from "@/lib/actions/admin";

type SerializedCart = Omit<Cart, 'created_at' | 'updated_at'> & {
  created_at: string;
  updated_at: string;
};

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<SerializedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SerializedCart | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [savingPrice, setSavingPrice] = useState<string | null>(null);

  useEffect(() => {
    getAdminCarts().then(data => {
      setCarts(data as SerializedCart[]);
      setLoading(false);
    });
  }, []);

  function openCart(cart: SerializedCart) {
    setSelected(cart);
    setShareUrl(cart.is_public_link
      ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://eqilo.fi'}/cart/${cart.id}`
      : null
    );
    const inputs: Record<string, string> = {};
    cart.items.forEach(item => {
      inputs[item.product_id] = item.custom_price_override != null
        ? String(item.custom_price_override)
        : "";
    });
    setPriceInputs(inputs);
  }

  async function handleGenerateLink() {
    if (!selected) return;
    setShareLoading(true);
    const res = await generateShareableCartLink(selected.id);
    if (res.success && res.url) {
      setShareUrl(res.url);
      setCarts(prev => prev.map(c => c.id === selected.id ? { ...c, is_public_link: true } : c));
      setSelected(prev => prev ? { ...prev, is_public_link: true } : null);
      toast.success("Shareable link generated");
    } else {
      toast.error(res.error || "Failed to generate link");
    }
    setShareLoading(false);
  }

  async function handleCopyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handlePriceOverride(item: CartItem) {
    if (!selected) return;
    const raw = priceInputs[item.product_id];
    const newPrice = parseFloat(raw);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    setSavingPrice(item.product_id);
    const res = await updateCartItemPrice(selected.id, item.product_id, newPrice);
    if (res.success) {
      toast.success("Price overridden");
      const updatedItems = selected.items.map(i =>
        i.product_id === item.product_id ? { ...i, custom_price_override: newPrice } : i
      );
      setSelected(prev => prev ? { ...prev, items: updatedItems } : null);
      setCarts(prev => prev.map(c => c.id === selected.id ? { ...c, items: updatedItems } : c));
    } else {
      toast.error(res.error || "Failed to update price");
    }
    setSavingPrice(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carts & Shareable Links</h1>
        <p className="text-muted-foreground">View active carts, override item prices, and generate shareable links for customers.</p>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold">Cart ID</TableHead>
              <TableHead className="font-bold">User / Customer ID</TableHead>
              <TableHead className="font-bold">Items</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Last Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : carts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No active carts found.</TableCell>
              </TableRow>
            ) : (
              carts.map((cart) => (
                <TableRow key={cart.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => openCart(cart)}>
                  <TableCell className="font-mono font-bold text-sm">#{cart.id.slice(-8).toUpperCase()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{cart.user_id || "Anonymous"}</TableCell>
                  <TableCell className="text-sm">{cart.items.reduce((s, i) => s + i.quantity, 0)} items</TableCell>
                  <TableCell>
                    {cart.is_public_link ? (
                      <Badge className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"><Link2 className="w-3 h-3" /> Public Link</Badge>
                    ) : (
                      <Badge variant="secondary" className="font-bold">Private</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(cart.updated_at).toLocaleDateString('fi-FI')}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="font-bold" onClick={e => { e.stopPropagation(); openCart(cart); }}>
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Cart #{selected.id.slice(-8).toUpperCase()}
                </SheetTitle>
                <p className="text-xs text-muted-foreground font-mono">{selected.user_id || "Anonymous"}</p>
              </SheetHeader>

              {/* Shareable Link */}
              <section className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Shareable Link</h3>
                {shareUrl ? (
                  <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-3 border border-border/50">
                    <code className="text-xs font-mono flex-1 truncate text-primary">{shareUrl}</code>
                    <Button variant="ghost" size="sm" className="shrink-0" onClick={handleCopyLink}>
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <a href={shareUrl} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full font-bold gap-2" onClick={handleGenerateLink} disabled={shareLoading}>
                    {shareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                    Generate Shareable Link
                  </Button>
                )}
              </section>

              {/* Items with price override */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Items & Price Overrides</h3>
                <div className="space-y-3">
                  {selected.items.map((item) => (
                    <div key={item.product_id} className="bg-muted/30 rounded-xl p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{item.product_id}</p>
                          <p className="font-bold text-sm">× {item.quantity}</p>
                        </div>
                        {item.custom_price_override != null && (
                          <Badge variant="outline" className="text-xs font-bold border-amber-200 bg-amber-50 text-amber-700">
                            Custom: {formatPrice(item.custom_price_override)} €
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Override price (€)"
                          value={priceInputs[item.product_id] ?? ""}
                          onChange={e => setPriceInputs(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          className="font-bold shrink-0"
                          disabled={savingPrice === item.product_id}
                          onClick={() => handlePriceOverride(item)}
                        >
                          {savingPrice === item.product_id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
