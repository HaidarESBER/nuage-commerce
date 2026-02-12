import { NextRequest, NextResponse } from "next/server";
import { RegisterData } from "@/types/user";
import { validatePassword } from "@/lib/password-validation";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body as RegisterData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validate password strength before calling Supabase
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    if (error) {
      // Map Supabase error messages to French
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Un compte existe deja avec cette adresse email" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Erreur lors de l'inscription" },
        { status: 400 }
      );
    }

    // Update profile with first_name and last_name
    // The handle_new_user trigger creates the profile row, but with empty names
    await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      })
      .eq("id", data.user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de l'inscription" },
      { status: 400 }
    );
  }
}
