"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Referral and UTM tracking library
 * Handles UTM parameter capture, referral link generation, and conversion tracking
 */

const VISITOR_ID_KEY = "nuage_visitor_id";
const UTM_SESSION_KEY = "nuage_utm_params";

/**
 * Generate a unique visitor session ID
 */
function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  let visitorId = sessionStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

/**
 * Capture UTM parameters from URL and track visit
 * Call this on page load (client-side only)
 */
export async function captureUTMParams(): Promise<void> {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
  };

  const referralCode = params.get("ref");

  // Check if we already captured UTM params this session
  const existingParams = sessionStorage.getItem(UTM_SESSION_KEY);
  const hasUTMParams = Object.values(utmParams).some((val) => val !== null);

  if (hasUTMParams && !existingParams) {
    // Store in session to avoid duplicate tracking
    sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(utmParams));
    await trackVisit(utmParams, referralCode || undefined);
  } else if (referralCode && !existingParams) {
    // Track referral even without UTM params
    await trackVisit({}, referralCode);
  }

  // Track referral click if ref param present
  if (referralCode) {
    await trackReferralClick(referralCode);
  }
}

/**
 * Track a visit with UTM parameters and optional referral code
 */
export async function trackVisit(
  utmParams: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_term?: string | null;
    utm_content?: string | null;
  },
  referralCode?: string
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const supabase = createClient();
    const visitorId = getOrCreateVisitorId();

    await supabase.from("utm_visits").insert({
      visitor_id: visitorId,
      utm_source: utmParams.utm_source || null,
      utm_medium: utmParams.utm_medium || null,
      utm_campaign: utmParams.utm_campaign || null,
      utm_term: utmParams.utm_term || null,
      utm_content: utmParams.utm_content || null,
      landing_page: window.location.pathname,
      referrer: document.referrer || null,
    });

    // Store referral code in session if present for conversion tracking
    if (referralCode) {
      sessionStorage.setItem("nuage_ref_code", referralCode);
    }
  } catch (error) {
    // Fail silently - tracking should never break the app
    console.error("Failed to track visit:", error);
  }
}

/**
 * Generate or retrieve user's referral link
 * Returns the full referral URL
 */
export async function generateReferralLink(userId: string): Promise<string> {
  try {
    const supabase = createClient();

    // Check if user already has a referral code
    const { data: existing } = await supabase
      .from("referral_links")
      .select("referral_code")
      .eq("user_id", userId)
      .single();

    if (existing) {
      return `${window.location.origin}/?ref=${existing.referral_code}`;
    }

    // Create new referral link (trigger will auto-generate code)
    const { data: newLink, error } = await supabase
      .from("referral_links")
      .insert({ user_id: userId, referral_code: "" }) // Empty string triggers auto-generation
      .select("referral_code")
      .single();

    if (error) throw error;

    return `${window.location.origin}/?ref=${newLink.referral_code}`;
  } catch (error) {
    console.error("Failed to generate referral link:", error);
    return `${window.location.origin}`;
  }
}

/**
 * Track a click on a referral link
 * Increments the clicks counter for the referral code
 */
export async function trackReferralClick(referralCode: string): Promise<void> {
  try {
    const supabase = createClient();

    // Increment clicks counter
    const { data: referral } = await supabase
      .from("referral_links")
      .select("clicks")
      .eq("referral_code", referralCode)
      .single();

    if (referral) {
      await supabase
        .from("referral_links")
        .update({ clicks: referral.clicks + 1 })
        .eq("referral_code", referralCode);
    }
  } catch (error) {
    console.error("Failed to track referral click:", error);
  }
}

/**
 * Track a referral conversion when an order is completed
 * Marks the visit as converted and increments referral conversions
 */
export async function trackReferralConversion(
  visitorId: string,
  orderId: string
): Promise<void> {
  try {
    const supabase = createClient();

    // Mark utm_visit as converted
    await supabase
      .from("utm_visits")
      .update({ converted: true, order_id: orderId })
      .eq("visitor_id", visitorId)
      .eq("converted", false);

    // Get referral code from session if exists
    const referralCode =
      typeof window !== "undefined"
        ? sessionStorage.getItem("nuage_ref_code")
        : null;

    if (referralCode) {
      // Increment conversions counter
      const { data: referral } = await supabase
        .from("referral_links")
        .select("conversions")
        .eq("referral_code", referralCode)
        .single();

      if (referral) {
        await supabase
          .from("referral_links")
          .update({ conversions: referral.conversions + 1 })
          .eq("referral_code", referralCode);
      }
    }
  } catch (error) {
    console.error("Failed to track referral conversion:", error);
  }
}

/**
 * Get referral stats for a user
 */
export async function getReferralStats(userId: string): Promise<{
  referralCode: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
} | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("referral_links")
      .select("referral_code, clicks, conversions")
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    return {
      referralCode: data.referral_code,
      clicks: data.clicks,
      conversions: data.conversions,
      conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0,
    };
  } catch (error) {
    console.error("Failed to get referral stats:", error);
    return null;
  }
}

/**
 * Get visitor ID for conversion tracking
 */
export function getVisitorId(): string {
  return getOrCreateVisitorId();
}
