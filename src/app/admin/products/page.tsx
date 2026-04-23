"use client";

import { useState, useEffect } from "react";
import { getProducts, getCategories, deleteProduct } from "@/lib/actions/admin";
import { Product, Category } from "@/lib/types/firestore";
import { ProductUpload } from "@/components/admin/ProductUpload";
import { ProductEditor } from "@/components/admin/ProductEditor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Plus, Pencil, Trash2, Search, ExternalLink, PackageOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(pData);
      setCategories(cData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      toast.error("Failed to load product catalog. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this product permanently?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Product deleted");
      loadData();
    } else {
      toast.error(res.error || "Failed to delete");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Catalog Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove products and manage inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <ProductUpload onImportSuccess={loadData} />
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger render={<Button onClick={() => setEditingProduct(null)} size="lg" className="font-bold shadow-md" />}>
              <Plus className="mr-2 h-5 w-5" /> Add Product
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{editingProduct ? "Edit Product" : "Create New Product"}</SheetTitle>
                <SheetDescription>
                  Modify product details, technical specs, and translations.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <ProductEditor 
                  product={editingProduct} 
                  categories={categories}
                  onSuccess={() => {
                    setIsSheetOpen(false);
                    loadData();
                  }}
                  onCancel={() => setIsSheetOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-xl shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Product</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="text-right font-bold">Price</TableHead>
              <TableHead className="text-right font-bold">Stock</TableHead>
              <TableHead className="text-center font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground animate-pulse">
                  Loading product catalog...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center border border-border/50 overflow-hidden shrink-0">
                        {p.image_urls?.[0] ? (
                          <img src={p.image_urls[0]} alt="" className="w-full h-full object-contain p-1" />
                        ) : (
                          <PackageOpen className="w-5 h-5 text-muted-foreground/50" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-none">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">{p.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary capitalize">
                      {p.category_id.replace(/-/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatPrice(p.price)} €</TableCell>
                  <TableCell className="text-right font-medium">{p.inventory_count}</TableCell>
                  <TableCell className="text-center">
                    {p.is_active ? (
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Active</span>
                    ) : (
                       <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border">Draft</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link href={`/product/${p.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:text-primary"
                        onClick={() => {
                          setEditingProduct(p);
                          setIsSheetOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
