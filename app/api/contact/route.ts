import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { contactMessages } from '@/shared/schema';

// GET /api/contact - Get all contact messages (protected)
export async function GET(request: NextRequest) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const messages = await db.query.contactMessages.findMany({
      orderBy: (messages, { desc }) => [desc(messages.submittedAt)]
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
    const now = new Date().toISOString();
    const newMessage = await db.insert(contactMessages)
      .values({
        name: body.name,
        email: body.email,
        subject: body.subject || '',
        message: body.message,
        submittedAt: now,
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