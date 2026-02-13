import { getAllDrafts } from '@/lib/curation';
import { getAllScrapedProducts } from '@/lib/scraper/data';
import { getAllScrapedReviews } from '@/lib/scraper/review-data';
import { PipelineBoard } from './PipelineBoard';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  // Fetch all pipeline data
  const [scrapedProducts, allDrafts, allReviews] = await Promise.all([
    getAllScrapedProducts(),
    getAllDrafts(),
    getAllScrapedReviews(),
  ]);

  // Count reviews per scraped product
  const reviewCountByScrapedProduct = new Map<string, number>();
  for (const review of allReviews) {
    const count = reviewCountByScrapedProduct.get(review.scrapedProductId) || 0;
    reviewCountByScrapedProduct.set(review.scrapedProductId, count + 1);
  }

  // Organize products by stage and attach review counts
  const stages = {
    scraped: scrapedProducts
      .filter(p => !allDrafts.some(d => d.scrapedProductId === p.id))
      .map(p => ({
        ...p,
        reviewCount: reviewCountByScrapedProduct.get(p.id) || 0,
      })),
    translating: allDrafts
      .filter(d => d.status === 'translating' || d.status === 'pending_translation')
      .map(d => ({
        ...d,
        reviewCount: d.scrapedProductId ? reviewCountByScrapedProduct.get(d.scrapedProductId) || 0 : 0,
      })),
    ready: allDrafts
      .filter(d => ['translated', 'approved'].includes(d.status) && !d.publishedProductId)
      .map(d => ({
        ...d,
        reviewCount: d.scrapedProductId ? reviewCountByScrapedProduct.get(d.scrapedProductId) || 0 : 0,
      })),
    published: allDrafts
      .filter(d => d.status === 'published' && d.publishedProductId)
      .map(d => ({
        ...d,
        reviewCount: d.scrapedProductId ? reviewCountByScrapedProduct.get(d.scrapedProductId) || 0 : 0,
      })),
  };

  const stats = {
    total: scrapedProducts.length + allDrafts.length,
    scraped: stages.scraped.length,
    translating: stages.translating.length,
    ready: stages.ready.length,
    published: stages.published.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[2000px] mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🚀 Pipeline Simplifiée
          </h1>
          <p className="text-muted">
            Gérez tout votre workflow de produits en un seul endroit
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-secondary rounded-lg p-4 border border-primary/10">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted">Total Produits</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.scraped}</div>
            <div className="text-sm text-blue-700">📥 Scrapés</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.translating}</div>
            <div className="text-sm text-yellow-700">🔄 En traduction</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
            <div className="text-sm text-green-700">✅ Prêts</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{stats.published}</div>
            <div className="text-sm text-purple-700">🎉 Publiés</div>
          </div>
        </div>

        {/* Pipeline Board */}
        <PipelineBoard stages={stages} />
      </div>
    </div>
  );
}
