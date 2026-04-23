"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Send } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { generateQuote } from "@/lib/actions/quotes";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

export function QuoteDialog() {
  const { items } = useCart();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    contact: "",
    email: "",
    reference: "",
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await generateQuote(items, details);

      if (res.success) {
        toast.success("Quote sent to your email!");
        setIsOpen(false);
      } else {
        toast.error(res.error || "Failed to send quote");
      }
    } catch (err) {
      console.error("Quote generation exception:", err);
      toast.error("An unexpected error occurred while generating the quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" className="w-full font-bold gap-2" />}>
        <FileText className="w-4 h-4" />
        {t("cart.request_quote") || "Request PDF Quote"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleGenerate}>
          <DialogHeader>
            <DialogTitle>{t("quote.title")}</DialogTitle>
            <DialogDescription>
              {t("quote.desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="org_name">{t("quote.org_name")}</Label>
              <Input
                id="org_name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                placeholder="e.g. Helsinki Agility Association"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact_person">{t("quote.contact_person")}</Label>
              <Input
                id="contact_person"
                value={details.contact}
                onChange={(e) => setDetails({ ...details, contact: e.target.value })}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
                placeholder="name@organization.fi"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reference">{t("quote.reference")} ({t("checkout.optional")})</Label>
              <Input
                id="reference"
                value={details.reference}
                onChange={(e) => setDetails({ ...details, reference: e.target.value })}
                placeholder="Project name or internal ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full font-bold">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("quote.generating")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("quote.download_button")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
