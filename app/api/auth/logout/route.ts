import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/logout - Log out a user
export async function POST(request: NextRequest) {
  try {
    // Clear the auth token cookie
    cookies().delete('auth_token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}