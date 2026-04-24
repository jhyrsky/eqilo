import { MetadataRoute } from 'next';
import { getProductsServer } from '@/lib/actions/products-server';
import { adminDb } from '@/lib/firebase/admin';
import sportsData from '@/data/sports.json';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eqilo.fi';

  // Fetch all active products using aggressive caching
  const products = await getProductsServer();

  // Fetch all categories
  const categoriesSnap = await adminDb.collection("categories").get();

  const productUrls: MetadataRoute.Sitemap = products.map((product) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedAt = (product as any).updated_at;
    let lastModified = new Date();
    if (updatedAt) {
      if (typeof updatedAt.toDate === 'function') {
        lastModified = updatedAt.toDate();
      } else if (updatedAt._seconds) {
        lastModified = new Date(updatedAt._seconds * 1000);
      }
    }
    return {
      url: `${baseUrl}/product/${product.id}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const categoryUrls: MetadataRoute.Sitemap = categoriesSnap.docs.map((doc) => ({
    url: `${baseUrl}/category/${doc.data().slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const sportUrls: MetadataRoute.Sitemap = sportsData.map((sport) => ({
    url: `${baseUrl}/sports/${sport.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sports`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/training-and-results`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/equipe-software`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...categoryUrls,
    ...sportUrls,
    ...productUrls,
  ];
}
