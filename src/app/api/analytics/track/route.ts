import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Track analytics event to server-side database
 * POST /api/analytics/track
 * Body: { eventType: string, eventData: object, sessionId: string, url: string, referrer?: string }
 *
 * Fire-and-forget pattern: Silent failures, no blocking, always returns 200
 * Privacy-compliant: Respects DNT header, sanitizes PII from event_data
 * Rate limiting: Max 100 events per session per minute
 */

// In-memory rate limiting (resets every minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of rateLimitMap.entries()) {
    if (now > data.resetAt) {
      rateLimitMap.delete(sessionId);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if session has exceeded rate limit
 */
function isRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(sessionId);

  if (!limit || now > limit.resetAt) {
    // Reset or initialize
    rateLimitMap.set(sessionId, {
      count: 1,
      resetAt: now + 60 * 1000, // 1 minute from now
    });
    return false;
  }

  if (limit.count >= 100) {
    // Rate limit exceeded
    return true;
  }

  // Increment count
  limit.count++;
  return false;
}

/**
 * Sanitize event data to remove PII
 */
function sanitizeEventData(data: any): any {
  if (!data || typeof data !== "object") return data;

  const sanitized = { ...data };
  const piiFields = [
    "email",
    "phone",
    "firstName",
    "lastName",
    "address",
    "postalCode",
    "creditCard",
    "password",
  ];

  for (const field of piiFields) {
    if (field in sanitized) {
      delete sanitized[field];
    }
  }

  return sanitized;
}

export async function POST(request: NextRequest) {
  try {
    // Respect Do Not Track header
    const dnt = request.headers.get("dnt");
    if (dnt === "1") {
      // Return 200 but don't track
      return new NextResponse(null, { status: 200 });
    }

    // Parse request body
    const body = await request.json();
    const { eventType, eventData, sessionId, url, referrer } = body;

    // Validate required fields
    if (!eventType || !sessionId) {
      return new NextResponse(null, { status: 200 }); // Fire-and-forget: no error response
    }

    // Rate limiting
    if (isRateLimited(sessionId)) {
      console.warn(
        `Rate limit exceeded for session ${sessionId.substring(0, 8)}`
      );
      return new NextResponse(null, { status: 200 }); // Silent drop
    }

    // Sanitize event data to remove PII
    const sanitizedData = sanitizeEventData(eventData || {});

    // Get user ID if authenticated (optional)
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch {
      // User not authenticated or error - continue without user_id
    }

    // Extract user agent from request headers
    const userAgent = request.headers.get("user-agent") || null;

    // Insert event using admin client (bypasses RLS)
    const adminClient = createAdminClient();
    await adminClient.from("analytics_events").insert({
      event_type: eventType,
      event_data: sanitizedData,
      session_id: sessionId,
      user_id: userId,
      url: url || null,
      referrer: referrer || null,
      user_agent: userAgent,
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    // Silent failure - log error but return 200 (never break client experience)
    console.error("Failed to track analytics event:", error);
    return new NextResponse(null, { status: 200 });
  }
}
