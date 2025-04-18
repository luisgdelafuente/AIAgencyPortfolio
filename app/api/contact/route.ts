import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { contactMessages, users, type ContactMessage } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/contact - Get all contact messages (protected)
export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const cookies = request.cookies;
    const sessionCookie = cookies.get("session")?.value;
    
    // Check authentication
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the user ID from the session cookie
    const userId = parseInt(sessionCookie, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    
    // Check if user exists and is authorized
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const messages = await db.query.contactMessages.findMany({
      orderBy: (contactMessages) => [desc(contactMessages.submittedAt)]
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

// POST /api/contact - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create the contact message
    const now = new Date();
    const newMessage = await db.insert(contactMessages)
      .values({
        name: body.name,
        email: body.email,
        subject: body.subject || '',
        message: body.message,
        submittedAt: now.toISOString(),
        read: false
      })
      .returning();
    
    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to create contact message' },
      { status: 500 }
    );
  }
}