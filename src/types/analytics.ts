export interface BrowseHistoryEntry {
  id: string;
  userId: string;
  productId: string;
  viewedAt: string;
}

export interface CategoryAffinity {
  category: string;
  viewCount: number;
  wishlistCount: number;
  purchaseCount: number;
  score: number; // Weighted score based on signals
}

export interface PriceRangePreference {
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
}
