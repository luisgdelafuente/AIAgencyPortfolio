import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// POST /api/auth/login - Login endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const userResult = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    
    if (!userResult) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Compare password
    const match = await bcrypt.compare(password, userResult.password);
    
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('auth_session', JSON.stringify({
      id: userResult.id,
      username: userResult.username
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    // Return success with user data (excluding password)
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userResult.id,
        username: userResult.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}