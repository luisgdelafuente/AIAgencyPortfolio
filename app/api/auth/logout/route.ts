import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - Log out a user
export async function POST(request: NextRequest) {
  try {
    // Clear the auth token cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth_token');
    
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}