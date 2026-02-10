import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserSession } from "@/types/user";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const userSession = JSON.parse(sessionCookie.value) as UserSession;

    return NextResponse.json({ user: userSession });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null });
  }
}
