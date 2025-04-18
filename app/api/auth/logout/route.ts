import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/logout - Logout endpoint
export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie
    const cookieStore = cookies();
    cookieStore.delete('auth_session');
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}