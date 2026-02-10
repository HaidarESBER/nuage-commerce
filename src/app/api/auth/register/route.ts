import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/users";
import { RegisterData } from "@/types/user";
import { cookies } from "next/headers";

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

    // Register user
    const userSession = await registerUser({
      email,
      password,
      firstName,
      lastName,
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      user: userSession,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de l'inscription" },
      { status: 400 }
    );
  }
}
