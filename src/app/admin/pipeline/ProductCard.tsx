'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { pipelineSendToCuration, pipelinePublish } from './actions';

interface ProductCardProps {
  product: any;
  stage: string;
  viewMode: 'kanban' | 'list';
}

export function ProductCard({ product, stage, viewMode }: ProductCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get product name from different sources (works for both scraped products and drafts)
  const getName = () => {
    // For drafts: curatedName > aiName > rawName
    // For scraped products: rawName
    return product.curatedName || product.aiName || product.rawName || 'Sans nom';
  };

  // Get product image (works for both scraped products and drafts)
  const getImage = () => {
    // For drafts: uploadedImages or curatedImages
    // For scraped products: uploadedImageUrls or rawImages
    const images = product.uploadedImages || product.curatedImages || product.uploadedImageUrls || product.rawImages || [];
    return images[0] || '/placeholder-product.png';
  };

  // Get review count
  const getReviewCount = () => {
    return product.reviewCount || 0;
  };

  // Handle send to curation (for scraped products)
  const handleSendToCuration = () => {
    startTransition(async () => {
      await pipelineSendToCuration(product.id);
      router.refresh();
    });
  };

  // Handle publish
  const handlePublish = () => {
    startTransition(async () => {
      await pipelinePublish(product.id);
      router.refresh();
    });
  };

  const cardClass = viewMode === 'kanban'
    ? 'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer'
    : 'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow';

  return (
    <div className={cardClass}>
      {/* Product Image */}
      <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={getImage()}
          alt={getName()}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">
          {getName()}
        </h3>

        {/* Metrics */}
        <div className="flex gap-2 text-xs text-gray-600">
          <span>⭐ {product.rating || 'N/A'}</span>
          <span>💬 {getReviewCount()} avis</span>
          {(product.curatedPrice || product.aiSuggestedPrice) && (
            <span>💰 {((product.curatedPrice || product.aiSuggestedPrice) / 100).toFixed(2)}€</span>
          )}
        </div>

        {/* Actions based on stage */}
        <div className="flex gap-2 pt-2">
          {stage === 'scraped' && (
            <button
              onClick={handleSendToCuration}
              disabled={isPending}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isPending ? '⏳' : '📝'} Curer
            </button>
          )}

          {stage === 'translating' && (
            <div className="flex-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs rounded text-center">
              🔄 Traduction...
            </div>
          )}

          {stage === 'ready' && (
            <>
              <button
                onClick={() => router.push(`/admin/curation/${product.id}`)}
                className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
              >
                ✏️ Éditer
              </button>
              <button
                onClick={handlePublish}
                disabled={isPending}
                className="flex-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isPending ? '⏳' : '🚀'} Publier
              </button>
            </>
          )}

          {stage === 'published' && (
            <button
              onClick={() => router.push(`/produits/${product.slug || product.id}`)}
              className="flex-1 px-3 py-1.5 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
            >
              👁️ Voir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
