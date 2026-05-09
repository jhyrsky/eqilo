import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart-provider";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/components/language-provider";
import { GoogleTagManager } from '@next/third-parties/google';
import { WhatsAppHelpdesk } from "@/components/WhatsAppHelpdesk";
import { CookieBanner } from "@/components/cookie-banner";
import { cookies } from "next/headers";
import { fetchStoreSettingsInternal } from "@/lib/actions/admin";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eqilo.fi'),
  title: {
    template: '%s | Eqilo.fi',
    default: 'Eqilo.fi - Modern Timekeeping Solutions',
  },
  description: "Eqilo provides modern timekeeping devices from Swiss manufacturer FDS Timing. Over 20 years of expertise for Finnish sport clubs.",
  keywords: ["FDS Timing", "timekeeping", "agility", "equestrian", "Eqilo", "Finland"],
  applicationName: 'Eqilo Webstore',
  authors: [{ name: 'Johannes Hyrsky', url: 'https://eqilo.fi/services' }],
  publisher: 'Eqilo Oy',
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: 'https://eqilo.fi',
  },
  openGraph: {
    title: 'Eqilo.fi - Modern Timekeeping Solutions',
    description: 'Eqilo provides modern timekeeping devices from Swiss manufacturer FDS Timing. Over 20 years of expertise for Finnish sport clubs.',
    url: 'https://eqilo.fi',
    siteName: 'Eqilo.fi',
    locale: 'fi_FI',
    type: 'website',
  },
  verification: {
    google: "LZj3B0ok1VW0eB_zpPPod5uAOugP2PkjrTrlLPS_Zac",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cookieStore, settings] = await Promise.all([
    cookies(),
    fetchStoreSettingsInternal(),
  ]);
  const consentCookie = cookieStore.get("eqilo_cookie_consent");
  const hasConsentedToTracking = consentCookie?.value === "accepted";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eqilo Oy',
    url: 'https://eqilo.fi',
    logo: 'https://eqilo.fi/eqilologo.webp',
    description: 'Finnish distributor of FDS Timing systems for equestrian and agility sports.',
    founder: {
      '@type': 'Person',
      name: 'Johannes Hyrsky',
      jobTitle: 'Timekeeping Expert',
    },
    telephone: '+358 50 5633097',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hakkapeliitantie 4',
      addressLocality: 'LOHJA',
      postalCode: '08350',
      addressCountry: 'FI'
    },
    sameAs: [
      'https://www.facebook.com/eqilo',
      'https://fdstiming.com/'
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {hasConsentedToTracking && <GoogleTagManager gtmId="G-ZRVTGT7VXH" />}
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <LanguageProvider>
              <AuthProvider>
                <CartProvider>
                  {children}
                  <WhatsAppHelpdesk phone={settings.whatsapp_number || settings.contact_phone} />
                  <CookieBanner />
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </NuqsAdapter>
          <Toaster position="bottom-right" theme="light" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
