import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

// Temporary secret key for JWT (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// GET /api/auth/check - Check if user is authenticated
export async function GET(request: NextRequest) {
  try {
    // Extract token from request cookies directly
    const token = request.cookies.get('auth_token');
    
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: number, username: string };
      
      // Verify the user exists
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.userId)
      });
      
      if (!user) {
        return NextResponse.json({ authenticated: false });
      }
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (jwtError) {
      // Token verification failed
      console.error('Token verification failed:', jwtError);
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { error: 'Authentication check failed', authenticated: false },
      { status: 500 }
    );
  }
}