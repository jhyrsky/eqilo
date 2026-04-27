"use client";

import { Product } from "@/lib/types/firestore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { useState, useTransition } from "react";
import { LocalizedDescription } from "@/components/LocalizedDescription";
import { useLanguage } from "@/components/language-provider";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  ChevronRight,
  PackageOpen,
  Pencil,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { formatPrice } from "@/lib/utils";
import { SEOContent as ProductSEO } from "@/components/seo/ProductSEO";
import { LocalizedSpecifications } from "@/components/LocalizedSpecifications";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { getCategories } from "@/lib/actions/admin";
import { Category } from "@/lib/types/firestore";

interface ProductContentProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductContent({ product, relatedProducts }: ProductContentProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const isAdmin = useIsAdmin();
  const [editOpen, setEditOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  async function openEditor() {
    if (!categories.length) {
      const cats = await getCategories();
      setCategories(cats);
    }
    setEditOpen(true);
  }

  const [selectedBundleOptions, setSelectedBundleOptions] = useState<string[]>(
    product.is_bundle && product.bundle_options 
      ? product.bundle_options.filter(o => !o.is_optional).map(o => o.id)
      : []
  );

  const toggleOption = (id: string) => {
    setSelectedBundleOptions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalPrice = product.price + (product.bundle_options?.filter(o => selectedBundleOptions.includes(o.id)).reduce((acc, o) => acc + (o.extra_price || 0), 0) || 0);

  return (
    <article itemScope itemType="https://schema.org/Product" className="container py-6 md:py-16">
      {isAdmin && (
        <>
          <Button
            onClick={openEditor}
            size="sm"
            variant="outline"
            className="fixed bottom-6 right-6 z-50 shadow-lg gap-2 font-bold"
          >
            <Pencil className="w-4 h-4" /> Edit Product
          </Button>
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Edit: {product.name}</SheetTitle>
              </SheetHeader>
              <ProductEditor
                product={product}
                categories={categories}
                onSuccess={() => setEditOpen(false)}
                onCancel={() => setEditOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </>
      )}
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center text-[10px] xs:text-xs font-bold text-muted-foreground/60 mb-6 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
        <Link href="/shop" className="hover:text-primary transition-colors">{t("nav.products")}</Link>
        <ChevronRight className="w-3 h-3 mx-2 opacity-50 shrink-0" />
        <span className="shrink-0">{t(`category.${product.category_id}`) !== `category.${product.category_id}` ? t(`category.${product.category_id}`) : product.category_id.replace(/-/g, ' ')}</span>
        <ChevronRight className="w-3 h-3 mx-2 opacity-50 shrink-0" />
        <span itemProp="name" className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-16 items-start">
        {/* Images Column */}
        <section aria-label="Product Images" className="space-y-4 md:sticky md:top-24">
          <div className="aspect-square bg-muted/30 rounded-2xl flex flex-col items-center justify-center border border-border/50 shadow-sm relative overflow-hidden bg-white">
             {product.image_urls && product.image_urls.length > 0 ? (
               <Image
                 src={product.image_urls[0]}
                 alt={product.name}
                 fill
                 className="object-contain p-6 xs:p-8 mix-blend-multiply"
                 priority
                 fetchPriority="high"
                 sizes="(max-width: 768px) 100vw, 50vw"
               />             ) : (
               <>
                 <Image 
                   src="/eqilologo.webp" 
                   alt="Eqilo Logo Placeholder" 
                   fill 
                   className="object-contain p-16 opacity-20 grayscale" 
                   sizes="(max-width: 768px) 100vw, 50vw"
                 />
                 <span className="text-muted-foreground font-bold tracking-tight absolute bottom-12 z-10 bg-white/80 px-3 py-1 rounded-md backdrop-blur-sm text-sm">{t("product.image_pending")}</span>
               </>
             )}
             <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono border z-10">SKU: {product.sku}</div>
          </div>
          {/* Thumbnails */}
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 px-1">
              {product.image_urls.map((url, i) => (
                <div key={i} className="w-16 h-16 xs:w-20 xs:h-20 shrink-0 bg-white rounded-xl border border-border/50 flex items-center justify-center hover:border-primary/50 cursor-pointer transition-colors relative overflow-hidden">
                  <Image src={url} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover p-2 mix-blend-multiply" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Details Column */}
        <section aria-labelledby="product-details" className="flex flex-col min-w-0">
          <h1 id="product-details" className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2 text-foreground leading-tight">{product.name}</h1>
          <p className="text-muted-foreground mb-6 font-mono text-[10px] xs:text-xs bg-muted/50 w-fit px-2 py-1 rounded font-bold uppercase tracking-wider">{t("product.sku")}: {product.sku}</p>
          
          <div className="mb-8">
            <PriceDisplay price={totalPrice} taxRate={product.tax_rate} size="xl" align="left" className="text-primary" />
          </div>
          {product.is_bundle && product.bundle_options && (
            <div className="mb-8 p-4 xs:p-6 bg-muted/30 rounded-2xl border border-border/50">
              <h3 className="text-md xs:text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-tight">
                <PackageOpen className="w-5 h-5 text-primary" />
                {t("product.customize_kit")}
              </h3>
              <div className="space-y-3">
                {product.bundle_options.map((option) => (
                  <div key={option.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={option.id} 
                        checked={selectedBundleOptions.includes(option.id)}
                        disabled={!option.is_optional}
                        onCheckedChange={() => toggleOption(option.id)}
                      />
                      <label htmlFor={option.id} className="text-xs xs:text-sm font-bold cursor-pointer flex flex-col">
                        <span>{option.name}</span>
                        {option.base_quantity > 1 && <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t("product.quantity")}: {option.base_quantity}</span>}
                      </label>
                    </div>
                    {option.extra_price && option.extra_price > 0 && (
                      <span className="text-[10px] xs:text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                        +{formatPrice(option.extra_price)} €
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-4 xs:p-5 mb-8 flex items-start gap-4">
            <div className="p-2 bg-emerald-500 rounded-full shrink-0">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-black text-emerald-900 text-sm uppercase tracking-tight">{t("product.standard_shipping")}</h4>
              <p className="text-xs xs:text-sm text-emerald-800/70 mt-1 font-semibold leading-relaxed">
                {t("product.shipping_details")}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <Button
              size="lg"
              className="w-full text-md xs:text-lg h-14 xs:h-16 font-black shadow-xl hover:shadow-2xl transition-all rounded-2xl uppercase tracking-wider"
              disabled={isPending}
              onClick={() => {
                startTransition(() => {
                  addItem(product.id, 1, selectedBundleOptions);
                });
              }}
            >
              <ShoppingCart className="mr-2 w-5 h-5 xs:w-6 xs:h-6" />
              {isPending ? t("product.adding") : t("product.add_to_cart")}
            </Button>
          </div>
          <Accordion className="w-full" defaultValue={["description", "specs"]}>
            <AccordionItem value="description" className="border-border/50">
              <AccordionTrigger className="text-md font-black uppercase tracking-tight py-4 hover:no-underline">{t("product.description")}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed prose prose-sm dark:prose-invert font-medium overflow-x-auto w-full">
                <LocalizedDescription product={product} />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="specs" className="border-border/50">
              <AccordionTrigger className="text-md font-black uppercase tracking-tight py-4 hover:no-underline">{t("product.specs")}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium">
                {product.specifications || product.specifications_fi || product.specifications_se ? (
                  <div className="pt-2">
                    <LocalizedSpecifications product={product} />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-3 border-b border-border/50 text-sm">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">{t("product.weight")}</span>
                      <span>{product.weight ? `${product.weight} kg` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50 text-sm">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">{t("product.category")}</span>
                      <span className="capitalize">{t(`category.${product.category_id}`) !== `category.${product.category_id}` ? t(`category.${product.category_id}`) : product.category_id.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="pt-4 prose prose-sm dark:prose-invert">
                       <p className="text-xs italic text-muted-foreground">More specifications listed in the description.</p>
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            {product.box_contents && (
              <AccordionItem value="box_contents" className="border-border/50">
                <AccordionTrigger className="text-md font-black uppercase tracking-tight py-4 hover:no-underline">{t("product.box_contents")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed font-medium">
                   <p className="whitespace-pre-line">{product.box_contents}</p>
                </AccordionContent>
              </AccordionItem>
            )}

            {product.downloads && product.downloads.length > 0 && (
              <AccordionItem value="downloads" className="border-border/50">
                <AccordionTrigger className="text-md font-black uppercase tracking-tight py-4 hover:no-underline">{t("product.downloads")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed font-medium">
                   <ul className="space-y-3">
                     {product.downloads.map((d, idx) => (
                       <li key={idx}>
                         <a href={d.url} target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold flex items-center gap-2">
                           <ChevronRight className="w-4 h-4" /> {d.name}
                         </a>
                       </li>
                     ))}
                   </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {product.videos && product.videos.length > 0 && (
              <AccordionItem value="videos" className="border-border/50">
                <AccordionTrigger className="text-md font-black uppercase tracking-tight py-4 hover:no-underline">{t("product.videos") || "Tutorial Videos"}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-medium pt-2">
                  <div className="grid gap-6">
                    {product.videos.map((video, idx) => {
                      const isYoutube = video.url.includes("youtube.com") || video.url.includes("youtu.be");
                      let embedUrl = video.url;
                      
                      if (isYoutube) {
                        if (video.url.includes("watch?v=")) {
                          embedUrl = video.url.replace("watch?v=", "embed/");
                        } else if (video.url.includes("youtu.be/")) {
                          embedUrl = video.url.replace("youtu.be/", "youtube.com/embed/");
                        }
                      }
                      
                      return (
                        <div key={idx} className="space-y-2">
                          <p className="font-bold text-foreground text-sm">{video.name}</p>
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/50 shadow-sm">
                            <iframe 
                              src={embedUrl} 
                              title={video.name}
                              className="absolute top-0 left-0 w-full h-full"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="guarantee" className="border-border/50">
              <AccordionTrigger className="text-md font-black uppercase tracking-tight py-4 hover:no-underline">{t("product.guarantee")}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium">
                <div className="flex items-start gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                  <p className="text-sm leading-relaxed">
                    {t("product.guarantee_desc")}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </section>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-border/50">
          <h2 className="text-2xl xs:text-3xl font-black tracking-tight mb-8 uppercase text-foreground">{t("product.related")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map(related => (
              <Link key={related.id} href={`/product/${related.id}`} className="group">
                <div className="bg-card text-card-foreground rounded-2xl border border-border/50 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all hover:border-primary/40">
                  <div className="aspect-square bg-muted/10 p-6 flex items-center justify-center relative border-b border-border/50 group-hover:bg-muted/30 transition-colors">
                    {related.image_urls?.[0] ? (
                      <Image 
                        src={related.image_urls[0]} 
                        alt={related.name} 
                        fill 
                        className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <Image src="/eqilologo.webp" alt="Logo" fill className="object-contain p-10 grayscale" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">{related.name}</h3>
                    <div className="mt-auto pt-4">
                      <PriceDisplay price={related.price} taxRate={related.tax_rate} size="sm" align="left" hideDetails />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-20">
        <ProductSEO />
      </div>
    </article>
  );
}
