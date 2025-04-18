import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Delete auth cookie
    const cookieStore = cookies();
    cookieStore.delete('auth_session');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred during logout' 
    }, { status: 500 });
  }
}