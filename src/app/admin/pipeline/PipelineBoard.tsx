'use client';

import { useState } from 'react';
import { ProductCard } from './ProductCard';

interface PipelineBoardProps {
  stages: {
    scraped: any[];
    translating: any[];
    ready: any[];
    published: any[];
  };
}

export function PipelineBoard({ stages }: PipelineBoardProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  if (view === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setView('kanban')}
            className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-accent transition-colors"
          >
            📊 Vue Kanban
          </button>
        </div>
        {/* List view implementation */}
        <div className="space-y-6">
          {Object.entries(stages).map(([stage, products]) => (
            <div key={stage}>
              <h2 className="text-xl font-bold mb-4 capitalize">{stage}</h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    stage={stage}
                    viewMode="list"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setView('list')}
          className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-primary/10 transition-colors border border-primary/20"
        >
          📋 Vue Liste
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-6">
        {/* Scraped Column */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-blue-100 rounded-lg p-4 border-2 border-blue-300">
            <h2 className="font-bold text-blue-800 flex items-center gap-2">
              <span className="text-2xl">📥</span>
              <span>Scrapés ({stages.scraped.length})</span>
            </h2>
            <p className="text-xs text-blue-600 mt-1">
              Produits bruts en attente de traitement
            </p>
          </div>
          <div className="space-y-3">
            {stages.scraped.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stage="scraped"
                viewMode="kanban"
              />
            ))}
          </div>
        </div>

        {/* Translating Column */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-yellow-100 rounded-lg p-4 border-2 border-yellow-300">
            <h2 className="font-bold text-yellow-800 flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <span>En traduction ({stages.translating.length})</span>
            </h2>
            <p className="text-xs text-yellow-600 mt-1">
              IA en train de traduire et améliorer
            </p>
          </div>
          <div className="space-y-3">
            {stages.translating.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stage="translating"
                viewMode="kanban"
              />
            ))}
          </div>
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-green-100 rounded-lg p-4 border-2 border-green-300">
            <h2 className="font-bold text-green-800 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>Prêts ({stages.ready.length})</span>
            </h2>
            <p className="text-xs text-green-600 mt-1">
              Prêts à être publiés sur le site
            </p>
          </div>
          <div className="space-y-3">
            {stages.ready.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stage="ready"
                viewMode="kanban"
              />
            ))}
          </div>
        </div>

        {/* Published Column */}
        <div className="space-y-4">
          <div className="sticky top-0 bg-purple-100 rounded-lg p-4 border-2 border-purple-300">
            <h2 className="font-bold text-purple-800 flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <span>Publiés ({stages.published.length})</span>
            </h2>
            <p className="text-xs text-purple-600 mt-1">
              En ligne et visibles aux clients
            </p>
          </div>
          <div className="space-y-3">
            {stages.published.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stage="published"
                viewMode="kanban"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
