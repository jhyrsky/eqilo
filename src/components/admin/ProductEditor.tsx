"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, Category } from "@/lib/types/firestore";
import { upsertProduct } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload, X, GripVertical } from "lucide-react";
import { uploadProductImage } from "@/lib/actions/admin";
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  price: z.coerce.number().min(0),
  tax_rate: z.coerce.number().min(0),
  inventory_count: z.coerce.number().int().min(0),
  category_id: z.string().min(1, "Please select a category"),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  description: z.string().min(1, "Description is required"),
  description_fi: z.string().optional(),
  description_se: z.string().optional(),
  weight: z.coerce.number().optional(),
  box_contents: z.string().optional(),
});

interface ProductEditorProps {
  product?: Product | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductEditor({ product, categories, onSuccess, onCancel }: ProductEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videos, setVideos] = useState<{ name: string; url: string }[]>(product?.videos || []);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      price: product?.price || 0,
      tax_rate: product?.tax_rate || 25.5,
      inventory_count: product?.inventory_count || 0,
      category_id: product?.category_id || "",
      is_active: product?.is_active ?? true,
      is_featured: product?.is_featured ?? false,
      description: product?.description || "",
      description_fi: product?.description_fi || "",
      description_se: product?.description_se || "",
      weight: product?.weight || 0,
      box_contents: product?.box_contents || "",
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const sku = product?.sku || `tmp-${Date.now()}`;
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(Math.round((i / files.length) * 100));
      const fd = new FormData();
      fd.append("file", files[i]);
      fd.append("sku", sku);
      const res = await uploadProductImage(fd);
      if (res.url) {
        uploaded.push(res.url);
      } else {
        toast.error(res.error || "Upload failed");
      }
    }
    setUploadProgress(100);
    setImageUrls(prev => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = "";
    if (uploaded.length) toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
  }

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setIsSubmitting(true);
    const data = {
      ...values,
      image_urls: imageUrls,
      downloads: product?.downloads || [],
      videos,
    };

    const res = await upsertProduct(product?.id || null, data);
    if (res.success) {
      toast.success(product ? "Product updated" : "Product created");
      onSuccess();
    } else {
      toast.error(res.error || "Failed to save product");
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. TBOX Wireless" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="FDS-..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...(field as InputHTMLAttributes<HTMLInputElement>)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...(field as InputHTMLAttributes<HTMLInputElement>)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventory_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...(field as InputHTMLAttributes<HTMLInputElement>)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Visibility in the store.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured</FormLabel>
                  <FormDescription>
                    Show in homepage carousel.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...(field as InputHTMLAttributes<HTMLInputElement>)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="box_contents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Box Contents</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Tabs defaultValue="en" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="fi">Finnish</TabsTrigger>
            <TabsTrigger value="se">Swedish</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="pt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="fi" className="pt-4">
            <FormField
              control={form.control}
              name="description_fi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finnish Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="se" className="pt-4">
            <FormField
              control={form.control}
              name="description_se"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swedish Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base">Images</FormLabel>
            <label className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
              <Upload className="w-4 h-4" /> {uploading ? `Uploading… ${uploadProgress}%` : "Upload"}
            </label>
          </div>
          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted/30">
                  <Image src={url} alt="" fill className="object-contain p-2" sizes="120px" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx > 0 && (
                      <Button type="button" size="icon" variant="secondary" className="h-7 w-7" title="Move left"
                        onClick={() => setImageUrls(v => { const a = [...v]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; return a; })}>
                        <GripVertical className="w-3 h-3" />
                      </Button>
                    )}
                    <Button type="button" size="icon" variant="destructive" className="h-7 w-7"
                      onClick={() => setImageUrls(v => v.filter((_, i) => i !== idx))}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  {idx === 0 && <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold">Main</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No images yet.</p>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base">Tutorial Videos</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={() => setVideos(v => [...v, { name: "", url: "" }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Video
            </Button>
          </div>
          {videos.map((video, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input
                placeholder="Title"
                value={video.name}
                onChange={e => setVideos(v => v.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))}
                className="w-1/3"
              />
              <Input
                placeholder="YouTube URL"
                value={video.url}
                onChange={e => setVideos(v => v.map((x, i) => i === idx ? { ...x, url: e.target.value } : x))}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setVideos(v => v.filter((_, i) => i !== idx))}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
