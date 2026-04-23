import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { 
    key: 'Content-Security-Policy', 
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://storage.googleapis.com https://firebasestorage.googleapis.com https://placehold.co; font-src 'self' data:; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.youtube.com blob: data: about:; connect-src 'self' https://api.stripe.com https://*.googleapis.com https://*.firebaseio.com https://www.google-analytics.com;"
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
    // Optimize LCP by enabling modern AVIF formats which are 20% smaller than WebP
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    // Enable optimizing package imports to reduce bundle size and INP
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  serverExternalPackages: ['pdfmake'],
};

export default nextConfig;
