import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated (admin OR regular user)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If not authenticated, try admin check
    let isAdmin = false;
    if (authError || !user) {
      try {
        await requireAdmin();
        isAdmin = true;
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const formData = await request.formData();

    // Support both single file (admin) and multiple photos (reviews)
    const singleFile = formData.get("file") as File | null;
    const multiplePhotos = formData.getAll("photos") as File[];

    const files = singleFile ? [singleFile] : multiplePhotos;

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

    // Different size limits: admin=5MB, user reviews=2MB
    const maxSize = isAdmin ? (5 * 1024 * 1024) : (2 * 1024 * 1024);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.` },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        const limit = isAdmin ? "5MB" : "2MB";
        return NextResponse.json(
          { error: `File ${file.name} exceeds ${limit}` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Different paths: admin=products/, user=review-photos/
      const folder = isAdmin ? "products" : `review-photos/${user?.id || 'admin'}`;
      const filePath = `${folder}/${fileName}`;

      // Convert File to ArrayBuffer then to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
    }

    // Return format depends on request type
    if (singleFile) {
      // Admin single file upload
      return NextResponse.json({
        success: true,
        url: uploadedUrls[0],
      });
    } else {
      // User multiple photos upload
      return NextResponse.json({ urls: uploadedUrls });
    }
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
