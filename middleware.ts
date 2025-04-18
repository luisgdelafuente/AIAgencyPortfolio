import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/admin',
  '/admin/blog',
  '/admin/projects',
  '/admin/messages',
  '/admin/settings',
  '/admin/waitlist',
  '/admin/content',
  '/admin/dashboard'
];

// Temporary secret key for JWT (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Middleware for authentication
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the requested path is a protected route
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    // Access token directly from the cookies in the request
    const token = request.cookies.get('auth_token');
    
    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token.value, JWT_SECRET);
      
      // Valid token, allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  // For non-protected routes, continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*'
  ]
};