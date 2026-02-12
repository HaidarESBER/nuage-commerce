import { NextRequest, NextResponse } from "next/server";
import { LoginData } from "@/types/user";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as LoginData;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Fetch profile to get additional data (first_name, last_name, is_admin)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        isAdmin: profile?.is_admin || false,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la connexion" },
      { status: 401 }
    );
  }
}
