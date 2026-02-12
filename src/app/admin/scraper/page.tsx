import { getScraperStats, getAllScrapedProducts } from "@/lib/scraper/data";
import { ScraperDashboard } from "./ScraperDashboard";

export const dynamic = "force-dynamic";

export default async function AdminScraperPage() {
  const [stats, scrapedProducts] = await Promise.all([
    getScraperStats(),
    getAllScrapedProducts(),
  ]);

  return <ScraperDashboard stats={stats} scrapedProducts={scrapedProducts} />;
}
