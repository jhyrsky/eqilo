import React from 'react';
import { Product } from '@/lib/types/firestore';
import { formatPrice } from '@/lib/utils';

export function AIProductSchema({ product }: { product: Product }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eqilo.fi';
  const productUrl = `${baseUrl}/product/${product.id}`;
  const orgId = `${baseUrl}/#organization`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Organization / Brand Context
      {
        '@type': 'Organization',
        '@id': orgId,
        name: 'Eqilo Oy',
        url: baseUrl,
        logo: `${baseUrl}/eqilologo.webp`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+358 50 5633097',
          contactType: 'customer service',
          contactOption: 'TollFree',
          areaServed: 'FI',
          availableLanguage: ['FI', 'EN', 'SV']
        },
      },
      // 2. The Product
      {
        '@type': 'Product',
        '@id': `${productUrl}/#product`,
        name: product.name,
        description: product.description,
        image: product.image_urls?.[0],
        sku: product.sku,
        brand: { '@id': orgId },
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'EUR',
          price: product.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.inventory_count > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'FI',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
          },
        },
      },
      // 3. FAQ Context (Crucial for Perplexity / SearchGPT)
      {
        '@type': 'FAQPage',
        '@id': `${productUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `Mikä on takuu tuotteelle ${product.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kaikilla FDS Timing -laitteilla on 2 vuoden takuu ja Eqilon yli 20 vuoden paikallinen asiantuntijatuki.',
            },
          },
          {
            '@type': 'Question',
            name: `Kuinka pitkä toimitusaika on tuotteelle ${product.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tuotteet toimitetaan suoraan Suomeen. Vakiotoimitus on 1-2 viikkoa. Yli 200 € tilauksiin ilmainen toimitus.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
