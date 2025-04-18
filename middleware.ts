import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run before all requests
export async function middleware(request: NextRequest) {
  // Only run this middleware for admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip the middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for the session cookie
  const sessionCookie = request.cookies.get('session');

  // If there's no session cookie, redirect to the login page
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Parse the session cookie value
    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if the cookie contains valid user data
    if (!sessionData || !sessionData.userId || !sessionData.username) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If everything is good, proceed to the requested page
    return NextResponse.next();
  } catch (error) {
    // If there's an error parsing the cookie, redirect to the login page
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure the matcher to run this middleware only for admin routes
export const config = {
  matcher: '/admin/:path*',
};