import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/auth/check - Check if user is authenticated
export async function GET(request: NextRequest) {
  try {
    // Get auth cookie
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth_session');
    
    if (!authCookie || !authCookie.value) {
      return NextResponse.json({
        authenticated: false,
        user: null
      });
    }
    
    // Parse cookie value
    const sessionData = JSON.parse(authCookie.value);
    
    // Return authenticated user
    return NextResponse.json({
      authenticated: true,
      user: {
        id: sessionData.id,
        username: sessionData.username
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      authenticated: false,
      user: null
    });
  }
}