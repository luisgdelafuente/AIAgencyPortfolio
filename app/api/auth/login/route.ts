import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users } from '@/shared/schema';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Username and password are required' 
      }, { status: 400 });
    }

    // Find user
    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = foundUsers[0];

    // Check if user exists
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid username or password' 
      }, { status: 401 });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid username or password' 
      }, { status: 401 });
    }

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('auth_session', JSON.stringify({ 
      id: user.id, 
      username: user.username 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // Return user info (without password)
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}