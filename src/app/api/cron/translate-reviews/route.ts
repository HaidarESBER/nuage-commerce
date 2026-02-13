import { NextRequest, NextResponse } from "next/server";
import { batchTranslateReviews } from "@/lib/ai/translate-reviews";

/**
 * Cron job to translate pending reviews to French
 * Configured to run every 6 hours via vercel.json
 *
 * Endpoint: GET /api/cron/translate-reviews
 * Auth: Bearer token via CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron (production) or allow all (dev)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // Translate up to 10 pending reviews
    const result = await batchTranslateReviews(10);

    console.log(
      `[Cron /api/cron/translate-reviews] ${result.translated} translated, ${result.errors} errors`
    );

    return NextResponse.json({
      success: true,
      translated: result.translated,
      errors: result.errors,
      errorDetails: result.errorDetails,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Cron /api/cron/translate-reviews] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
