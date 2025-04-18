import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get auth cookie
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth_session');

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ authenticated: false });
    }

    // Parse user data from cookie
    const userData = JSON.parse(authCookie.value);

    if (!userData || !userData.id || !userData.username) {
      return NextResponse.json({ authenticated: false });
    }

    // Return authentication state and user data
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.id,
        username: userData.username
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      message: 'An error occurred during authentication check' 
    }, { status: 500 });
  }
}