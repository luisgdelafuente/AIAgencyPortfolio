import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// POST /api/auth/register - Register a new admin user (protected)
export async function POST(request: NextRequest) {
  try {
    // In a production environment, this endpoint might be disabled or highly restricted
    // Check if there's an existing admin user - if so, require authentication
    const existingUsers = await db.query.users.findMany({
      limit: 1
    });
    
    // If there are existing users, this should be a protected route
    // For now, just allow registration if there are no users (initial setup)
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Registration is disabled' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate the request body
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, body.username)
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    
    // Create the user
    const newUser = await db.insert(users)
      .values({
        username: body.username,
        password: hashedPassword
      })
      .returning();
    
    // Return user information (excluding password)
    return NextResponse.json({
      id: newUser[0].id,
      username: newUser[0].username
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}