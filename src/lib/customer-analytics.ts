/**
 * Customer Intelligence & RFM Analysis Library
 * Phase 23-01: Customer Segmentation & RFM Analysis
 *
 * Purpose: Query and analyze customer purchase behavior using RFM methodology
 * Uses: createAdminClient() for admin-only access
 */

import { createAdminClient } from '@/lib/supabase/admin';

// =============================================================================
// TypeScript Types
// =============================================================================

export interface CustomerRFM {
  email: string;
  firstName: string;
  lastName: string;
  recency: number; // days since last order
  frequency: number; // total orders
  monetary: number; // total revenue in cents
  recencyScore: number; // 1-5
  frequencyScore: number; // 1-5
  monetaryScore: number; // 1-5
  rfmScore: string; // e.g., "555", "344"
  segment: 'VIP' | 'Champions' | 'Fidèles' | 'À Risque' | 'Inactifs';
  firstOrderDate: string;
  lastOrderDate: string;
  avgOrderValue: number; // cents
}

export interface CustomerSegmentStats {
  segment: string;
  count: number;
  percentage: number;
  totalRevenue: number; // cents
  avgOrderValue: number; // cents
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate quintile score for a value within an array
 * @param value - Value to score
 * @param sortedValues - Array of values sorted ascending
 * @returns Score from 1 (lowest quintile) to 5 (highest quintile)
 */
function calculateQuintileScore(value: number, sortedValues: number[]): number {
  const n = sortedValues.length;
  if (n === 0) return 1;
  if (n === 1) return 5;

  // Find position in sorted array
  let position = 0;
  for (let i = 0; i < sortedValues.length; i++) {
    if (sortedValues[i] <= value) {
      position = i;
    }
  }

  // Convert position to quintile (1-5)
  const percentile = (position + 1) / n;
  if (percentile <= 0.2) return 1;
  if (percentile <= 0.4) return 2;
  if (percentile <= 0.6) return 3;
  if (percentile <= 0.8) return 4;
  return 5;
}

/**
 * Determine customer segment based on RFM score
 * @param rfmScore - Three-digit RFM score (e.g., "555", "344")
 * @returns Segment label in French
 */
function determineSegment(rfmScore: string): 'VIP' | 'Champions' | 'Fidèles' | 'À Risque' | 'Inactifs' {
  // VIP: 555, 554, 545, 455
  if (['555', '554', '545', '455'].includes(rfmScore)) {
    return 'VIP';
  }

  // Champions: 544, 454, 445, 444, 543
  if (['544', '454', '445', '444', '543'].includes(rfmScore)) {
    return 'Champions';
  }

  // Fidèles: 434, 443, 344, 353, 433
  if (['434', '443', '344', '353', '433'].includes(rfmScore)) {
    return 'Fidèles';
  }

  // À Risque: 343, 334, 333, 324, 243
  if (['343', '334', '333', '324', '243'].includes(rfmScore)) {
    return 'À Risque';
  }

  // Inactifs: Everything else (low scores)
  return 'Inactifs';
}

// =============================================================================
// Query Helpers
// =============================================================================

/**
 * Get RFM analysis for all customers with purchase history
 * @returns Array of customers with RFM scores and segments, sorted by monetary value DESC
 */
export async function getRFMSegments(): Promise<CustomerRFM[]> {
  const supabase = createAdminClient();

  // Query all orders with email
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('user_email, total, created_at')
    .order('created_at', { ascending: true });

  if (ordersError) {
    console.error('getRFMSegments orders error:', ordersError.message);
    throw new Error(`Failed to fetch orders: ${ordersError.message}`);
  }

  if (!orders || orders.length === 0) {
    return [];
  }

  // Query all profiles to get first_name and last_name
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('email, first_name, last_name');

  if (profilesError) {
    console.error('getRFMSegments profiles error:', profilesError.message);
    // Continue without profiles - will use email as fallback
  }

  // Create profile lookup map
  const profileMap = new Map<string, { firstName: string; lastName: string }>();
  if (profiles && profiles.length > 0) {
    for (const profile of profiles) {
      profileMap.set(profile.email, {
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
      });
    }
  }

  // Aggregate customer data
  const now = new Date();
  const customerMap = new Map<string, {
    frequency: number;
    monetary: number;
    firstOrderDate: string;
    lastOrderDate: string;
  }>();

  for (const order of orders) {
    const email = order.user_email;
    const existing = customerMap.get(email);

    if (existing) {
      customerMap.set(email, {
        frequency: existing.frequency + 1,
        monetary: existing.monetary + order.total,
        firstOrderDate: existing.firstOrderDate, // Keep earliest
        lastOrderDate: order.created_at, // Update to latest
      });
    } else {
      customerMap.set(email, {
        frequency: 1,
        monetary: order.total,
        firstOrderDate: order.created_at,
        lastOrderDate: order.created_at,
      });
    }
  }

  // Calculate recency and build customer array
  const customers = Array.from(customerMap.entries()).map(([email, data]) => {
    const lastOrderDate = new Date(data.lastOrderDate);
    const recencyDays = Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));

    const profile = profileMap.get(email);

    return {
      email,
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      recency: recencyDays,
      frequency: data.frequency,
      monetary: data.monetary,
      firstOrderDate: data.firstOrderDate,
      lastOrderDate: data.lastOrderDate,
      avgOrderValue: Math.round(data.monetary / data.frequency),
    };
  });

  // Calculate quintile scores
  // For recency: lower is better (invert: 0 days = 5 score, 90+ days = 1 score)
  const recencyValues = customers.map(c => c.recency).sort((a, b) => a - b);
  const frequencyValues = customers.map(c => c.frequency).sort((a, b) => a - b);
  const monetaryValues = customers.map(c => c.monetary).sort((a, b) => a - b);

  // Score each customer and determine segment
  const customersWithRFM: CustomerRFM[] = customers.map(customer => {
    // Recency score: invert (lower days = higher score)
    const recencyScore = 6 - calculateQuintileScore(customer.recency, recencyValues);
    const frequencyScore = calculateQuintileScore(customer.frequency, frequencyValues);
    const monetaryScore = calculateQuintileScore(customer.monetary, monetaryValues);

    const rfmScore = `${recencyScore}${frequencyScore}${monetaryScore}`;
    const segment = determineSegment(rfmScore);

    return {
      ...customer,
      recencyScore,
      frequencyScore,
      monetaryScore,
      rfmScore,
      segment,
    };
  });

  // Sort by monetary value descending
  return customersWithRFM.sort((a, b) => b.monetary - a.monetary);
}

/**
 * Get aggregated statistics by customer segment
 * @returns Array of segment stats sorted by total revenue DESC
 */
export async function getCustomerSegmentStats(): Promise<CustomerSegmentStats[]> {
  const customers = await getRFMSegments();

  if (customers.length === 0) {
    return [];
  }

  // Group by segment
  const segmentMap = new Map<string, {
    count: number;
    totalRevenue: number;
    totalOrders: number;
  }>();

  for (const customer of customers) {
    const segment = customer.segment;
    const existing = segmentMap.get(segment);

    if (existing) {
      segmentMap.set(segment, {
        count: existing.count + 1,
        totalRevenue: existing.totalRevenue + customer.monetary,
        totalOrders: existing.totalOrders + customer.frequency,
      });
    } else {
      segmentMap.set(segment, {
        count: 1,
        totalRevenue: customer.monetary,
        totalOrders: customer.frequency,
      });
    }
  }

  const totalCustomers = customers.length;

  // Convert to array with calculated metrics
  const stats: CustomerSegmentStats[] = Array.from(segmentMap.entries()).map(
    ([segment, data]) => ({
      segment,
      count: data.count,
      percentage: (data.count / totalCustomers) * 100,
      totalRevenue: data.totalRevenue,
      avgOrderValue: Math.round(data.totalRevenue / data.totalOrders),
    })
  );

  // Sort by total revenue descending
  return stats.sort((a, b) => b.totalRevenue - a.totalRevenue);
}

/**
 * Get top N customers by total revenue
 * @param limit - Number of top customers to return (default: 20)
 * @returns Array of top customers with RFM metrics
 */
export async function getTopCustomers(limit: number = 20): Promise<CustomerRFM[]> {
  const customers = await getRFMSegments();

  // Already sorted by monetary value DESC in getRFMSegments
  return customers.slice(0, limit);
}
