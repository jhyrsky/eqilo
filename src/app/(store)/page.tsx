import { getProductsServer } from "@/lib/actions/products-server";
import HomeContent from "./HomeContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etusivu - Eqilo.fi",
  description: "Modernit FDS Timing ajanottoratkaisut ja urheiluteknologia Suomessa. Osta tai vuokraa ammattilaistason laitteita ratsastukseen ja agilityyn.",
};

export default async function HomePage() {
  const all = await getProductsServer();
  const featured = all.filter(p => p.is_featured && p.image_urls && p.image_urls.length > 0);
  const featuredProducts = featured.length > 0
    ? featured
    : all.filter(p => p.image_urls && p.image_urls.length > 0).slice(0, 6);

  return <HomeContent featuredProducts={JSON.parse(JSON.stringify(featuredProducts))} />;
}
