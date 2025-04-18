import { NextRequest, NextResponse } from 'next/server';

// Middleware to handle authentication
export async function middleware(request: NextRequest) {
  // Skip middleware for API routes (they handle their own auth)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Skip middleware for non-admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Skip middleware for the login page itself
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  const authCookie = request.cookies.get('auth_session');
  
  if (!authCookie || !authCookie.value) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*'],
};