import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run before all requests
export async function middleware(request: NextRequest) {
  // Only run this middleware for admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip the middleware for the admin login page
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.next();
  }

  // Skip the middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for the auth cookie
  const authCookie = request.cookies.get('auth_session');

  // If there's no auth cookie, redirect to the admin login page
  if (!authCookie || !authCookie.value) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  try {
    // Parse the auth cookie value
    const userData = JSON.parse(authCookie.value);
    
    // Check if the cookie contains valid user data
    if (!userData || !userData.id || !userData.username) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // If everything is good, proceed to the requested page
    return NextResponse.next();
  } catch (error) {
    // If there's an error parsing the cookie, redirect to the login page
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/admin', request.url));
  }
}

// Configure the matcher to run this middleware only for admin routes
export const config = {
  matcher: '/admin/:path*',
};