import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * API endpoint to process product images with local SD
 * Requires local Python server running on localhost:5001
 */

const SD_SERVER_URL = process.env.SD_SERVER_URL || "http://localhost:5001";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin status
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { image_url, style = "brown-gradient", product_id } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: "image_url is required" },
        { status: 400 }
      );
    }

    // Check if SD server is available
    const healthCheck = await fetch(`${SD_SERVER_URL}/health`, {
      method: "GET",
    }).catch(() => null);

    if (!healthCheck || !healthCheck.ok) {
      return NextResponse.json(
        {
          error: "SD server not available",
          message: "Make sure Python server is running on localhost:5001",
        },
        { status: 503 }
      );
    }

    // Process image with local SD
    const response = await fetch(`${SD_SERVER_URL}/process-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url,
        style,
        prompt: "professional product photo for e-commerce, studio lighting, clean background",
        remove_bg: true,
        use_ai_bg: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "SD processing failed");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Processing failed");
    }

    // Store processed image for review in Supabase
    const { data: processedImage, error: dbError } = await supabase
      .from("processed_images")
      .insert({
        product_id,
        original_url: image_url,
        processed_data: result.image, // base64
        status: "pending_review",
        processing_metadata: {
          style,
          width: result.width,
          height: result.height,
          processed_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error storing processed image:", dbError);
      // Return result anyway, just log the error
    }

    return NextResponse.json({
      success: true,
      processed_image: result.image,
      width: result.width,
      height: result.height,
      record_id: processedImage?.id,
    });
  } catch (error: any) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      {
        error: "Processing failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Batch process multiple images
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { images, style = "brown-gradient" } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "images array is required" },
        { status: 400 }
      );
    }

    // Process batch
    const response = await fetch(`${SD_SERVER_URL}/batch-process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: images.map((img) => ({
          image_url: img.url,
          style,
        })),
      }),
      // Long timeout for batch processing
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Batch processing failed");
    }

    // Store all in database
    const records = result.results.map((res: any, idx: number) => ({
      product_id: images[idx].product_id,
      original_url: images[idx].url,
      processed_data: res.image,
      status: "pending_review",
      processing_metadata: {
        style,
        batch_id: Date.now(),
      },
    }));

    await supabase.from("processed_images").insert(records);

    return NextResponse.json({
      success: true,
      processed: result.results.length,
      results: result.results,
    });
  } catch (error: any) {
    console.error("Error batch processing:", error);
    return NextResponse.json(
      {
        error: "Batch processing failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
