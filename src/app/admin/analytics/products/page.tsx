/**
 * Product Analytics Page
 * Admin dashboard for product performance and search insights
 */

import { getTopEvents, TopEvent } from "@/lib/analytics-server";
import TopProducts from "@/components/admin/TopProducts";
import SearchAnalytics from "@/components/admin/SearchAnalytics";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analyse des Produits - Admin Nuage",
  description: "Performance des produits et insights de recherche",
};

export default async function ProductAnalyticsPage() {
  // Fetch top events with error handling
  let viewedProducts: TopEvent[] = [];
  let cartProducts: TopEvent[] = [];
  let topSearches: TopEvent[] = [];

  try {
    viewedProducts = await getTopEvents("product_view", 10);
  } catch (error) {
    console.error("Failed to fetch viewed products:", error);
  }

  try {
    cartProducts = await getTopEvents("add_to_cart", 10);
  } catch (error) {
    console.error("Failed to fetch cart products:", error);
  }

  try {
    topSearches = await getTopEvents("search", 20);
  } catch (error) {
    console.error("Failed to fetch top searches:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-accent hover:underline transition-colors"
        >
          ← Retour au tableau de bord
        </Link>
        <h2 className="mt-4 text-2xl font-heading font-semibold text-primary">
          Analyse des Produits
        </h2>
        <p className="mt-2 text-primary/70">
          Performance des produits et insights de recherche
        </p>
      </div>

      {/* Top Products */}
      <section className="bg-white rounded-lg border border-primary/10 p-6">
        <TopProducts
          viewedProducts={viewedProducts}
          cartProducts={cartProducts}
        />
      </section>

      {/* Search Analytics */}
      <section className="bg-white rounded-lg border border-primary/10 p-6">
        <SearchAnalytics topSearches={topSearches} />
      </section>
    </div>
  );
}
