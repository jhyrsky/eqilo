"use server";
import { adminDb, adminAuth } from "../firebase/admin";
import * as xlsx from "xlsx";
import { Product, Category } from "../types/firestore";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

function serializeDoc(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (value && typeof (value as any).toDate === 'function') {
        return [key, (value as any).toDate().toISOString()];
      }
      return [key, value];
    })
  );
}

async function checkAdmin() {
  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get("idToken")?.value;

    if (!idToken) return false;

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Primary: look up by UID
    const userDoc = await adminDb.collection("customers").doc(decodedToken.uid).get();
    if (userDoc.exists && userDoc.data()?.role === "admin") return true;

    // Fallback: look up by email (handles mismatched UIDs from different auth methods)
    if (decodedToken.email) {
      const snap = await adminDb.collection("customers")
        .where("email", "==", decodedToken.email)
        .where("role", "==", "admin")
        .limit(1)
        .get();
      if (!snap.empty) return true;
    }

    return false;
  } catch (error) {
    console.error("[checkAdmin] Error:", error);
    return false;
  }
}

export async function importProducts(formData: FormData) {
  try {
    // 1. Authorization Check
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { success: false, error: "Access Denied: Administrative privileges required." };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData: unknown[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let currentCategory = "Uncategorized";
    const products: Partial<Product>[] = [];

    const startIdx = rawData.findIndex(r => r[1] && String(r[1]).startsWith('FDS-'));
    const safeStartIdx = startIdx !== -1 ? startIdx : 3;

    for (let i = safeStartIdx; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;

      if (row[0] && typeof row[0] === 'string' && row[0].trim() !== '') {
        currentCategory = row[0].trim();
      }

      const sku = row[1];
      const descriptionEN = row[2];
      const priceStr = row[3];

      if (!sku || typeof sku !== 'string' || !sku.startsWith('FDS-')) continue;
      
      const rawPrice = parseFloat(String(priceStr).replace(',', '.'));
      if (isNaN(rawPrice)) continue;
      const price = rawPrice * 1.255;

      const name = String(descriptionEN).split(' - ')[0] || String(descriptionEN);
      const description = String(descriptionEN);

      products.push({
        id: sku.trim(),
        name: name.trim(),
        description: description.trim(),
        category_id: currentCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: price,
        tax_rate: 25.5,
        sku: sku.trim(),
        excel_ref_id: sku.trim(),
        inventory_count: 10,
        is_active: true,
        image_urls: [],
      });
    }

    const batch = adminDb.batch();
    const productsRef = adminDb.collection("products");
    const categoriesRef = adminDb.collection("categories");

    // Collect unique categories seen in this import
    const seenCategories = new Map<string, string>(); // slug -> display name
    products.forEach((product) => {
      if (product.category_id && !seenCategories.has(product.category_id)) {
        // Reconstruct display name from slug (title-case each word)
        const displayName = (product.category_id as string)
          .replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        seenCategories.set(product.category_id as string, displayName);
      }
    });

    products.forEach((product) => {
      const docRef = productsRef.doc(product.id as string);
      batch.set(docRef, product, { merge: true });
    });

    seenCategories.forEach((name, slug) => {
      const catRef = categoriesRef.doc(slug);
      batch.set(catRef, { id: slug, name, slug }, { merge: true });
    });

    await batch.commit();

    return { success: true, count: products.length };
  } catch (error: any) {
    console.error("Failed to import products:", error);
    return { success: false, error: error.message || "Failed to parse file" };
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const snapshot = await adminDb.collection("products").get();
    return snapshot.docs.map(doc => ({ ...serializeDoc(doc.data()), id: doc.id }) as Product);
  } catch (error) {
    console.error("[getProducts] Error:", error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const doc = await adminDb.collection("products").doc(id).get();
    if (!doc.exists) return null;
    return { ...doc.data(), id: doc.id } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function upsertProduct(id: string | null, data: Partial<Product>) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const productsRef = adminDb.collection("products");
    if (id) {
      await productsRef.doc(id).update({ ...data, updated_at: new Date() });
    } else {
      const newDoc = productsRef.doc();
      await newDoc.set({ 
        ...data, 
        id: newDoc.id,
        created_at: new Date(),
        updated_at: new Date() 
      });
    }
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidateTag("products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");
    await adminDb.collection("products").doc(id).delete();
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidateTag("products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const snapshot = await adminDb.collection("categories").get();
    return snapshot.docs.map(doc => ({ ...serializeDoc(doc.data()), id: doc.id }) as Category);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function upsertCategory(id: string | null, data: Partial<Category>) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const categoriesRef = adminDb.collection("categories");
    if (id) {
      await categoriesRef.doc(id).update(data);
    } else {
      const newDoc = categoriesRef.doc();
      await newDoc.set({ ...data, id: newDoc.id });
    }
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");
    await adminDb.collection("categories").doc(id).delete();
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function syncCategoriesFromProducts() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const snapshot = await adminDb.collection("products").get();
    const seen = new Map<string, string>();

    snapshot.docs.forEach(doc => {
      const slug = doc.data().category_id as string;
      if (slug && !seen.has(slug)) {
        const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        seen.set(slug, name);
      }
    });

    const batch = adminDb.batch();
    const categoriesRef = adminDb.collection("categories");
    seen.forEach((name, slug) => {
      batch.set(categoriesRef.doc(slug), { id: slug, name, slug }, { merge: true });
    });
    await batch.commit();

    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, count: seen.size };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
