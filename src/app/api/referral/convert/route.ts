import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/referral/convert
 *
 * Track a referral conversion when an order is completed.
 * This is called server-side from the Stripe webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const { visitorId, orderId } = await request.json();

    if (!visitorId || !orderId) {
      return NextResponse.json(
        { error: "Missing visitorId or orderId" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Mark utm_visit as converted
    await supabase
      .from("utm_visits")
      .update({ converted: true, order_id: orderId })
      .eq("visitor_id", visitorId)
      .eq("converted", false);

    // Try to find and increment referral_links conversions
    // First, get the visit to check if it came from a referral
    const { data: visit } = await supabase
      .from("utm_visits")
      .select("referrer")
      .eq("visitor_id", visitorId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Extract referral code from referrer if present (e.g., ?ref=ABC123)
    if (visit?.referrer) {
      const refMatch = visit.referrer.match(/[?&]ref=([A-Z0-9]+)/);
      if (refMatch) {
        const referralCode = refMatch[1];

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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track referral conversion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
