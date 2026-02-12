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

// Server-side analytics event (matches analytics_events table schema)
export interface ServerAnalyticsEvent {
  id: string;
  event_type: string;
  event_data: Record<string, any>;
  session_id: string;
  user_id: string | null;
  created_at: string;
  url: string | null;
  referrer: string | null;
  user_agent: string | null;
}

// Event tracking options for API payload
export interface EventTrackingOptions {
  eventType: string;
  eventData: Record<string, any>;
  sessionId: string;
  url: string;
  referrer?: string;
}
