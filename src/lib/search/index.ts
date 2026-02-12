/**
 * Search helper functions
 *
 * Integrates FlexSearch with filters, sorting, facets, and pagination.
 * Designed for Server Component execution with URL-based state.
 */

import type { Product, ProductCategory } from '@/types/product';
import type { SearchParams, SearchResult, FacetCounts, SortOption } from '@/types/search';
import { searchProducts } from './flexsearch';

const PRODUCTS_PER_PAGE = 24;

const PRICE_RANGES = [
  { label: '0-50€', min: 0, max: 5000 },
  { label: '50-100€', min: 5000, max: 10000 },
  { label: '100-200€', min: 10000, max: 20000 },
  { label: '200€+', min: 20000, max: Infinity },
];

/**
 * Calculate facet counts from products
 *
 * @param products - Products to analyze
 * @returns Facet counts for categories and price ranges
 */
export function calculateFacets(products: Product[]): FacetCounts {
  const categories: Record<ProductCategory, number> = {
    chicha: 0,
    bol: 0,
    tuyau: 0,
    charbon: 0,
    accessoire: 0,
  };

  const priceRanges = PRICE_RANGES.map((range) => ({
    ...range,
    count: 0,
  }));

  for (const product of products) {
    // Count by category
    categories[product.category] = (categories[product.category] || 0) + 1;

    // Count by price range
    for (const range of priceRanges) {
      if (product.price >= range.min && product.price < range.max) {
        range.count++;
        break;
      }
    }
  }

  return {
    categories,
    priceRanges,
  };
}

/**
 * Apply filters to product list
 *
 * @param products - Products to filter
 * @param params - Search parameters with filters
 * @returns Filtered products
 */
function applyFilters(products: Product[], params: SearchParams): Product[] {
  let filtered = products;

  // Filter by category
  if (params.category) {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  // Filter by price range
  if (params.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  return filtered;
}

/**
 * Apply sorting to product list
 *
 * @param products - Products to sort
 * @param sort - Sort option
 * @param hasQuery - Whether a search query is active (affects relevance sort)
 * @returns Sorted products
 */
function applySort(
  products: Product[],
  sort: SortOption,
  hasQuery: boolean
): Product[] {
  const sorted = [...products];

  switch (sort) {
    case 'relevance':
      // If query exists, products are already ranked by FlexSearch
      // If no query, sort by featured then name
      if (!hasQuery) {
        sorted.sort((a, b) => {
          if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
          }
          return a.name.localeCompare(b.name, 'fr');
        });
      }
      break;

    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;

    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;

    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      break;
  }

  return sorted;
}

/**
 * Build search query with filters, sorting, facets, and pagination
 *
 * This is the main search function called from Server Components.
 *
 * Process:
 * 1. If query exists: use FlexSearch to get ranked product IDs
 * 2. If no query: use all products
 * 3. Apply filters (category, price range)
 * 4. Apply sort (relevance if query, otherwise by sort param)
 * 5. Calculate facet counts from filtered results
 * 6. Apply pagination (24 per page)
 *
 * @param products - All available products
 * @param params - Search parameters from URL
 * @returns Search result with products, total, and facets
 */
export async function buildSearchQuery(
  products: Product[],
  params: SearchParams
): Promise<SearchResult> {
  const {
    q = '',
    category,
    minPrice,
    maxPrice,
    sort = 'relevance',
    page = 1,
  } = params;

  const hasQuery = q.trim().length > 0;
  let matchingProducts: Product[];

  // Step 1: Search or use all products
  if (hasQuery) {
    // Use FlexSearch to get ranked product IDs
    const rankedIds = await searchProducts(q);
    const idToProduct = new Map(products.map((p) => [p.id, p]));
    matchingProducts = rankedIds
      .map((id) => idToProduct.get(id))
      .filter((p): p is Product => p !== undefined);
  } else {
    // No query: use all products
    matchingProducts = [...products];
  }

  // Step 2: Apply filters
  const filtered = applyFilters(matchingProducts, {
    category,
    minPrice,
    maxPrice,
  });

  // Step 3: Apply sort
  const sorted = applySort(filtered, sort as SortOption, hasQuery);

  // Step 4: Calculate facets from filtered results
  const facets = calculateFacets(sorted);

  // Step 5: Apply pagination
  const total = sorted.length;
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginated = sorted.slice(startIndex, endIndex);

  return {
    products: paginated,
    total,
    query: q,
    facets,
  };
}
