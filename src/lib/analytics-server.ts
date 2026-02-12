/**
 * Server-side analytics helper library
 * DO NOT confuse with client-side src/lib/analytics.ts
 *
 * Purpose: Query pre-aggregated metrics and raw events for admin dashboards
 * Uses: createAdminClient() for admin-only access
 *
 * Phase 21 will consume these helpers for admin analytics dashboards
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { ServerAnalyticsEvent } from '@/types/analytics';

// =============================================================================
// TypeScript Types
// =============================================================================

export interface DailyMetrics {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  total_events: number;
  unique_sessions: number;
  unique_users: number;
  page_views: number;
  product_views: number;
  add_to_cart_count: number;
  purchases: number;
  total_revenue: number; // in cents
  search_queries: number;
  avg_session_duration: number; // in seconds (placeholder)
  bounce_rate: number; // percentage (placeholder)
  created_at: string;
  updated_at: string;
}

export interface MetricsSummary {
  totalSessions: number;
  totalUsers: number;
  totalRevenue: number; // in cents
  totalPurchases: number;
  avgRevenuePerUser: number; // in cents
  conversionRate: number; // percentage
}

export interface TopEvent {
  key: string; // productId, query, etc.
  count: number;
  label?: string; // Optional human-readable label
}

// =============================================================================
// Query Helpers
// =============================================================================

/**
 * Get daily metrics for a date range
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Array of daily metrics ordered by date ascending
 */
export async function getDailyMetrics(
  startDate: Date,
  endDate: Date
): Promise<DailyMetrics[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('getDailyMetrics error:', error.message);
    throw new Error(`Failed to fetch daily metrics: ${error.message}`);
  }

  return data || [];
}

/**
 * Get aggregated metrics summary for last N days
 * @param days - Number of days to aggregate (default: 30)
 * @returns Summary object with totals and calculated metrics
 */
export async function getMetricsSummary(days: number = 30): Promise<MetricsSummary> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const metrics = await getDailyMetrics(startDate, endDate);

  // Aggregate totals
  const totalSessions = metrics.reduce((sum, m) => sum + m.unique_sessions, 0);
  const totalUsers = metrics.reduce((sum, m) => sum + m.unique_users, 0);
  const totalRevenue = metrics.reduce((sum, m) => sum + m.total_revenue, 0);
  const totalPurchases = metrics.reduce((sum, m) => sum + m.purchases, 0);

  // Calculate derived metrics
  const avgRevenuePerUser = totalUsers > 0 ? Math.round(totalRevenue / totalUsers) : 0;
  const conversionRate = totalSessions > 0 ? (totalPurchases / totalSessions) * 100 : 0;

  return {
    totalSessions,
    totalUsers,
    totalRevenue,
    totalPurchases,
    avgRevenuePerUser,
    conversionRate,
  };
}

/**
 * Get top events by type (most viewed products, top searches, etc.)
 * @param eventType - Event type to query (e.g., 'product_view', 'search')
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of top events with counts
 */
export async function getTopEvents(
  eventType: string,
  limit: number = 10
): Promise<TopEvent[]> {
  const supabase = createAdminClient();

  // Determine which JSONB key to group by based on event type
  let groupByKey: string;
  if (eventType === 'product_view') {
    groupByKey = 'productId';
  } else if (eventType === 'search') {
    groupByKey = 'query';
  } else {
    groupByKey = 'key'; // Generic fallback
  }

  // Query raw events and aggregate in application
  // (Supabase doesn't support GROUP BY JSONB fields easily in client lib)
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_data')
    .eq('event_type', eventType)
    .limit(10000); // Limit to prevent memory issues

  if (error) {
    console.error('getTopEvents error:', error.message);
    throw new Error(`Failed to fetch top events: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Aggregate counts in application
  const counts = new Map<string, number>();
  for (const row of data) {
    const key = row.event_data?.[groupByKey];
    if (key) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }

  // Convert to array and sort by count descending
  const topEvents = Array.from(counts.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return topEvents;
}

/**
 * Get most recent analytics events for real-time activity feed
 * @param limit - Maximum number of events to return (default: 50)
 * @returns Array of recent events ordered by created_at descending
 */
export async function getRealtimeEvents(limit: number = 50): Promise<ServerAnalyticsEvent[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getRealtimeEvents error:', error.message);
    throw new Error(`Failed to fetch realtime events: ${error.message}`);
  }

  return data || [];
}

/**
 * Trigger daily aggregation for a specific date
 * @param date - Date to aggregate (default: yesterday)
 * @returns void (throws on error)
 */
export async function triggerDailyAggregation(date?: Date): Promise<void> {
  const supabase = createAdminClient();

  // Default to yesterday if no date provided
  const targetDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dateString = targetDate.toISOString().split('T')[0];

  // Call the aggregate_daily_metrics function
  const { error } = await supabase.rpc('aggregate_daily_metrics', {
    target_date: dateString,
  });

  if (error) {
    console.error('triggerDailyAggregation error:', error.message);
    throw new Error(`Failed to trigger aggregation: ${error.message}`);
  }
}
