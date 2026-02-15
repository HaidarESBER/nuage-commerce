import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { getProductRatingStats } from "@/lib/reviews";
import { generateWebSiteSchema, safeJsonLd } from "@/lib/seo";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "Nuage | L'art de la detente - Chicha Premium en France",
  description:
    "Boutique en ligne de chichas et accessoires haut de gamme. Chichas, bols, tuyaux, charbon et accessoires de qualite superieure. Livraison en France.",
  alternates: {
    canonical: "https://nuage.fr",
  },
};

/**
 * Homepage with cinematic video hero and featured products
 *
 * Features:
 * - Full-screen video hero with smoke reveal effect
 * - Text overlay with shadows (no card background)
 * - Featured products section showcasing premium items
 * - WebSite schema with SearchAction for Google sitelinks search box
 * - French content throughout
 */
export default async function Home() {
  // Load products from JSON file
  const allProducts = await getAllProducts();

  // Fetch ratings for all products
  const ratingsMap = new Map();
  await Promise.all(
    allProducts.map(async (product) => {
      const stats = await getProductRatingStats(product.id);
      if (stats) {
        ratingsMap.set(product.id, stats);
      }
    })
  );

  const webSiteSchema = generateWebSiteSchema();

  return (
    <>
      {/* WebSite Structured Data with SearchAction for Google sitelinks search box */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webSiteSchema) }}
      />
      <HomeClient
        featuredProducts={allProducts}
        ratingsMap={Object.fromEntries(ratingsMap)}
      />
    </>
  );
}
