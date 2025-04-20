import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { contactMessages } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/contact/[id] - Get a contact message by ID (protected)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid contact message ID' },
        { status: 400 }
      );
    }
    
    const message = await db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, id)
    });
    
    if (!message) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error fetching contact message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact message' },
      { status: 500 }
    );
  }
}

// PATCH /api/contact/[id] - Mark a contact message as read (protected)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid contact message ID' },
        { status: 400 }
      );
    }
    
    // Check if the message exists
    const existingMessage = await db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, id)
    });
    
    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    // Update the message read status
    const updatedMessage = await db.update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    
    return NextResponse.json(updatedMessage[0]);
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}

// DELETE /api/contact/[id] - Delete a contact message (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid contact message ID' },
        { status: 400 }
      );
    }
    
    // Check if the message exists
    const existingMessage = await db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, id)
    });
    
    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    // Delete the message
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}