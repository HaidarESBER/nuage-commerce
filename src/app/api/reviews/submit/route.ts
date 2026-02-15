import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { productId, rating, comment, name, email, images } = body;

    // Validation
    if (!productId || !rating || !comment || !name || !email) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être entre 1 et 5" },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Le commentaire doit contenir au moins 10 caractères" },
        { status: 400 }
      );
    }

    // Get current user (optional - for logged-in users)
    const { data: { user } } = await supabase.auth.getUser();

    // Insert review with pending status
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: user?.id || null,
        rating,
        comment: comment.trim(),
        reviewer_name: name.trim(),
        reviewer_email: email.trim(),
        images: images || [],
        status: "pending", // Will be reviewed by admin
        verified_purchase: false, // Can be updated by admin
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return NextResponse.json(
        { error: "Échec de la soumission de l'avis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error in review submission:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
