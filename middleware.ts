import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't need authentication
  const isPublicPath = 
    path === "/login" || 
    !path.startsWith("/admin");

  // Get the session cookie
  const sessionCookie = request.cookies.get("session");
  const isAuthenticated = !!sessionCookie?.value;

  // If the path is a public path and user is authenticated, redirect to admin
  if (isPublicPath && isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If the path is not a public path and user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|hallogoblack480.webp).*)",
  ],
};