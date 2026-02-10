import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/users";
import { LoginData } from "@/types/user";
import { cookies } from "next/headers";

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

    // Authenticate user
    const userSession = await loginUser(email, password);

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la connexion" },
      { status: 401 }
    );
  }
}
