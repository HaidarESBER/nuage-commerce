/**
 * FlexSearch client-side search index
 *
 * Provides typo-tolerant product search with French language support.
 * Zero hosting costs - runs entirely in browser.
 */

import { Document } from 'flexsearch';
import type { Product } from '@/types/product';

/**
 * FlexSearch document schema matching Product type
 */
interface SearchDocument {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  [key: string]: string | string[];
}

/**
 * FlexSearch index singleton
 *
 * Configuration:
 * - tokenize: "forward" for prefix matching (instant search)
 * - encoder: "LatinBalance" for French text normalization and typo tolerance
 * - resolution: 9 for fuzzy matching sensitivity
 * - context: Enhanced relevance scoring with bidirectional context
 */
export const searchIndex = new Document<SearchDocument>({
  tokenize: "forward",
  encoder: "LatinBalance",
  resolution: 9,
  context: {
    resolution: 9,
    depth: 2,
    bidirectional: true,
  },
  document: {
    id: "id",
    index: ["name", "description", "category"],
    store: ["id", "slug"],
  },
});

/**
 * Index products for search
 *
 * Adds or updates all products in the search index.
 * Call this when products are loaded or updated.
 *
 * @param products - Array of products to index
 */
export function indexProducts(products: Product[]): void {
  products.forEach((product) => {
    const doc: SearchDocument = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category,
    };

    searchIndex.add(doc);
  });
}

/**
 * Search products by query string
 *
 * Uses FlexSearch fuzzy matching with typo tolerance.
 * Returns ranked product IDs (most relevant first).
 *
 * @param query - Search query string
 * @param options - Search options
 * @returns Array of product IDs ranked by relevance
 */
export async function searchProducts(
  query: string,
  options?: { limit?: number }
): Promise<string[]> {
  const { limit = 100 } = options ?? {};

  // Empty query returns empty results
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Search across all indexed fields
  const results = await searchIndex.searchAsync(query, {
    limit,
    index: ["name", "description", "category"],
    enrich: true,
  });

  // Flatten results from all fields and deduplicate by ID
  const seenIds = new Set<string>();
  const rankedIds: string[] = [];

  for (const fieldResult of results) {
    if (Array.isArray(fieldResult.result)) {
      for (const item of fieldResult.result) {
        const id = item.doc?.id as string;
        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          rankedIds.push(id);
        }
      }
    }
  }

  return rankedIds.slice(0, limit);
}
