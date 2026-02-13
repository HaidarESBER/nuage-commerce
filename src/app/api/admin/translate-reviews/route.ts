import { NextResponse } from "next/server";
import { batchTranslateReviews } from "@/lib/ai/translate-reviews";

/**
 * Admin endpoint to manually trigger review translation
 * No auth required in development for easy testing
 */
export async function POST() {
  try {
    // Translate up to 20 pending reviews
    const result = await batchTranslateReviews(20);

    console.log(
      `[Admin translate-reviews] ${result.translated} translated, ${result.errors} errors`
    );

    return NextResponse.json({
      success: true,
      translated: result.translated,
      errors: result.errors,
      errorDetails: result.errorDetails,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Admin translate-reviews] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
