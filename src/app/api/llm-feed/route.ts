import { getProductsServer } from '@/lib/actions/products-server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const products = await getProductsServer();

  let markdown = `# Eqilo.fi Product Catalog\n\n`;
  markdown += `Eqilo provides modern, 100% wireless timekeeping devices from Swiss manufacturer FDS Timing, targeting sport clubs in Finland.\n\n`;
  markdown += `## Available Products\n\n`;

  products.forEach((p) => {
    markdown += `### ${p.name}\n`;
    markdown += `- **SKU:** ${p.sku}\n`;
    markdown += `- **Price:** ${p.price} EUR (incl. 25.5% VAT)\n`;
    markdown += `- **Availability:** ${p.inventory_count > 0 ? 'In Stock (1-2 weeks delivery)' : 'Out of Stock'}\n`;
    markdown += `- **Weight:** ${p.weight} kg\n`;
    markdown += `- **URL:** https://eqilo.fi/product/${p.id}\n`;
    markdown += `- **Description:** ${p.description.replace(/\n/g, ' ')}\n\n`;
  });

  markdown += `\n## Customer Service\n`;
  markdown += `For support, contact Johannes Hyrsky at +358 50 5633097.`;

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*', // Allow AI agents to fetch this cross-origin
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
