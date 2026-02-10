"use server";

import { cookies } from "next/headers";
import { UserSession } from "@/types/user";

/**
 * Get the current user session from cookies
 * @returns User session if authenticated, null otherwise
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value) as UserSession;
    return session;
  } catch (error) {
    console.error("Failed to parse session cookie:", error);
    return null;
  }
}

/**
 * Require authentication - throws if user is not logged in
 * @returns User session
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();

  if (!session) {
    throw new Error("Authentication required");
  }

  return session;
}

/**
 * Require admin access - throws if user is not admin
 * @returns User session
 * @throws Error if not authenticated or not admin
 */
export async function requireAdmin(): Promise<UserSession> {
  const session = await requireAuth();

  if (!session.isAdmin) {
    throw new Error("Admin access required");
  }

  return session;
}

/**
 * Check if current user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Check if current user is admin
 * @returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.isAdmin === true;
}
