import { Product } from "@/types/product";

/**
 * Analytics wrapper - abstraction layer for tracking events
 *
 * For MVP: Console logging + localStorage event storage
 * Future: Easy swap to real analytics provider (GA4, Plausible, etc.)
 *
 * Privacy-compliant:
 * - No cookies set without consent (GDPR)
 * - Anonymous tracking (no PII)
 * - Respect Do Not Track header
 */

interface AnalyticsEvent {
  type: string;
  timestamp: string;
  data: any;
}

const STORAGE_KEY = 'nuage_analytics_events';
const MAX_STORED_EVENTS = 100;

/**
 * Check if analytics should be disabled
 */
function isTrackingDisabled(): boolean {
  // Respect Do Not Track browser setting
  if (navigator.doNotTrack === '1') {
    return true;
  }

  // Disable in development (optional)
  if (process.env.NODE_ENV === 'development') {
    return false; // Set to true to disable in dev
  }

  return false;
}

/**
 * Store event in localStorage (for MVP, before real analytics)
 */
function storeEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];

    events.push(event);

    // Keep only recent events to avoid localStorage bloat
    if (events.length > MAX_STORED_EVENTS) {
      events.splice(0, events.length - MAX_STORED_EVENTS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn('Failed to store analytics event:', error);
  }
}

/**
 * Log event to console in development
 */
function logEvent(eventType: string, data: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`📊 Analytics: ${eventType}`);
    console.log('Data:', data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}

/**
 * Generic event tracking
 */
function trackEvent(eventType: string, data: any = {}) {
  if (isTrackingDisabled()) return;

  const event: AnalyticsEvent = {
    type: eventType,
    timestamp: new Date().toISOString(),
    data,
  };

  logEvent(eventType, data);
  storeEvent(event);

  // In production, send to analytics provider here
  // Example: window.gtag?.('event', eventType, data);
}

// ============================================================================
// Page Views
// ============================================================================

export function trackPageView(url: string) {
  trackEvent('page_view', { url });
}

// ============================================================================
// E-commerce Events
// ============================================================================

export function trackProductView(productId: string, productName: string, price: number) {
  trackEvent('product_view', {
    productId,
    productName,
    price: (price / 100).toFixed(2),
    currency: 'EUR',
  });
}

export function trackAddToCart(product: Product, quantity: number = 1) {
  trackEvent('add_to_cart', {
    productId: product.id,
    productName: product.name,
    price: (product.price / 100).toFixed(2),
    quantity,
    currency: 'EUR',
    value: ((product.price * quantity) / 100).toFixed(2),
  });
}

export function trackRemoveFromCart(productId: string, productName: string, quantity: number) {
  trackEvent('remove_from_cart', {
    productId,
    productName,
    quantity,
  });
}

export interface Order {
  id: string;
  items: Array<{ product: Product; quantity: number }>;
  total: number;
  shipping: number;
  discount?: number;
}

export function trackPurchase(order: Order) {
  trackEvent('purchase', {
    orderId: order.id,
    revenue: (order.total / 100).toFixed(2),
    shipping: (order.shipping / 100).toFixed(2),
    discount: order.discount ? (order.discount / 100).toFixed(2) : '0.00',
    currency: 'EUR',
    items: order.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: (item.product.price / 100).toFixed(2),
      quantity: item.quantity,
    })),
  });
}

export function trackCheckoutStep(step: number, stepName: string) {
  trackEvent('checkout_step', {
    step,
    stepName,
  });
}

// ============================================================================
// Engagement Events
// ============================================================================

export function trackSearch(query: string, resultsCount: number) {
  trackEvent('search', {
    query,
    resultsCount,
  });
}

export function trackFilterApplied(filterType: string, filterValue: string) {
  trackEvent('filter_applied', {
    filterType,
    filterValue,
  });
}

export function trackWishlistAdd(productId: string) {
  trackEvent('wishlist_add', {
    productId,
  });
}

export function trackWishlistRemove(productId: string) {
  trackEvent('wishlist_remove', {
    productId,
  });
}

export function trackComparison(productIds: string[]) {
  trackEvent('comparison_view', {
    productIds,
    count: productIds.length,
  });
}

export function trackExitIntentShown() {
  trackEvent('exit_intent_shown', {});
}

export function trackExitIntentConverted(discountCode: string) {
  trackEvent('exit_intent_converted', {
    discountCode,
  });
}

// ============================================================================
// Core Web Vitals
// ============================================================================

export interface WebVital {
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export function trackWebVital(metric: WebVital) {
  trackEvent('web_vital', {
    name: metric.name,
    value: Math.round(metric.value),
    rating: metric.rating,
    id: metric.id,
  });
}

// ============================================================================
// Performance Monitoring
// ============================================================================

export function trackRouteChange(from: string, to: string, duration: number) {
  trackEvent('route_change', {
    from,
    to,
    duration: Math.round(duration),
  });
}

export function trackApiResponse(endpoint: string, duration: number, success: boolean) {
  trackEvent('api_response', {
    endpoint,
    duration: Math.round(duration),
    success,
  });
}

// ============================================================================
// Helper: Get stored events (for debugging/export)
// ============================================================================

export function getStoredEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to retrieve analytics events:', error);
    return [];
  }
}

export function clearStoredEvents() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear analytics events:', error);
  }
}
