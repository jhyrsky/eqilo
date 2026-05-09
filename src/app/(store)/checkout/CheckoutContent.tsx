"use client";

import { useCart } from "@/components/cart-provider";
import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types/firestore";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, Loader2, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface CheckoutContentProps {
  products: Product[];
}

export default function CheckoutContent({ products }: CheckoutContentProps) {
  const { items } = useCart();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [details, setDetails] = useState({
    email: "",
    phone: "",
    businessId: "",
    acceptTerms: false,
  });

  // Update details only when user becomes available initially
  useEffect(() => {
    if (user && !details.email) {
      setDetails(prev => ({
        ...prev,
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const cartItems = items.map(item => {
    const product = products.find(p => p.id === item.product_id);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);
  const hasTestProduct = cartItems.some(item => item.product!.sku === "TEST-1EUR");
  const shipping = (subtotal >= 200 || hasTestProduct) ? 0 : 20;
  const total = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!details.acceptTerms) return;

    setIsSubmitting(true);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : undefined;
    const res = await createCheckoutSession(user.uid, items, details, lang, baseUrl);
    if (res.success && res.url) {
      window.location.href = res.url;
    } else {
      toast.error(res.error || "Checkout failed");
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("cart.empty")}</h2>
        <Link href="/shop">
          <Button>{t("cart.browse")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10 text-foreground">{t("checkout.title")}</h1>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-primary" />
                 {t("checkout.billing")}
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={details.email} 
                      onChange={(e) => setDetails({ ...details, email: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.phone")}</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={details.phone} 
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_id">{t("footer.business_id")} ({t("checkout.optional")})</Label>
                  <Input 
                    id="business_id" 
                    placeholder="e.g. 1234567-8" 
                    value={details.businessId}
                    onChange={(e) => setDetails({ ...details, businessId: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t("checkout.b2b_note")}</p>
                </div>

                <Separator className="my-6 opacity-50" />

                <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <Checkbox 
                    id="terms" 
                    checked={details.acceptTerms}
                    onCheckedChange={(checked) => setDetails({ ...details, acceptTerms: !!checked })}
                    required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms" className="text-sm font-bold leading-none cursor-pointer">
                      {t("checkout.terms_agree")}
                    </label>
                    <Link href="/terms" className="text-xs text-primary hover:underline font-medium" target="_blank">
                       {t("nav.terms")}
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-4 rounded-lg border border-dashed">
             <Lock className="w-5 h-5" />
             <p className="text-xs font-medium italic">{t("checkout.stripe_note")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden sticky top-24">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                 <ShoppingBag className="w-5 h-5 text-primary" />
                 {t("cart.summary")}
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm group">
                    <div className="flex-1 pr-4">
                      <p className="font-bold group-hover:text-primary transition-colors">{item.product!.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity}x @ {formatPrice(item.product!.price)} €</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(item.product!.price * item.quantity)} €</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("product.incl_vat")} {item.product!.tax_rate || 25.5}%</p>
                    </div>
                  </div>
                ))}
                <Separator className="my-4 border-border/50" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground font-medium">
                    <span>{t("cart.subtotal")}</span>
                    <span>{formatPrice(subtotal)} €</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground font-medium">
                    <span>{t("cart.shipping")}</span>
                    <span>{shipping === 0 ? t("cart.free") : `${formatPrice(shipping)} €`}</span>
                  </div>
                  <div className="flex justify-between text-xl font-extrabold text-foreground pt-4 border-t">
                    <span>{t("cart.total")}</span>
                    <span>{formatPrice(total)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 pt-6">
               <Button 
                 type="submit" 
                 form="checkout-form"
                 disabled={isSubmitting || !details.acceptTerms || !user}
                 className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
               >
                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                 {t("checkout.place_order")}
                 {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
               </Button>
               {!user && (
                 <p className="text-sm text-destructive text-center mt-4 font-semibold">{t("checkout.login_required")}</p>
               )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
