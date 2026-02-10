import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('user_session');

    if (!sessionCookie) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/compte', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = JSON.parse(sessionCookie.value);

      // Check if user is admin
      if (!session.isAdmin) {
        // Non-admin users get redirected to home
        return NextResponse.redirect(new URL('/', request.url));
      }

    } catch (error) {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL('/compte', request.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/update-order-tracking') ||
      pathname.startsWith('/api/send-order-email') ||
      pathname.startsWith('/api/send-shipping-email')) {

    const sessionCookie = request.cookies.get('user_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      const session = JSON.parse(sessionCookie.value);

      // Check if user is admin
      if (!session.isAdmin) {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/update-order-tracking',
    '/api/send-order-email',
    '/api/send-shipping-email',
  ],
};
