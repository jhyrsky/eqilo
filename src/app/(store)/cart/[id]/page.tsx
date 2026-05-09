"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { getSharedCart } from "@/lib/actions/cart";
import { Loader2 } from "lucide-react";
import { use } from "react";

export default function SharedCartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { replaceItems } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSharedCart(id as string).then(res => {
      if (res.success && res.items) {
        replaceItems(res.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          custom_price_override: item.custom_price_override,
        })));
        router.replace("/cart");
      } else {
        setError(res.error || "This shared cart link is invalid or has expired.");
      }
    });
  }, [id, replaceItems, router]);

  if (error) {
    return (
      <div className="container py-20 text-center space-y-4">
        <p className="text-lg font-bold text-foreground">Link unavailable</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-20 flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Loading your cart…</p>
    </div>
  );
}
