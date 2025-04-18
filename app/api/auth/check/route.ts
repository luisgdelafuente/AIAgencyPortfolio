import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value);

    // Check if session has required fields
    if (!sessionData.userId || !sessionData.username) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          id: sessionData.userId,
          username: sessionData.username
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}