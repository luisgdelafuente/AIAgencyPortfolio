import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { waitlist } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/waitlist - Get all waitlist entries (protected)
export async function GET(request: NextRequest) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const entries = await db.query.waitlist.findMany({
      orderBy: (entries, { desc }: { desc: any }) => [desc(entries.submittedAt)]
    });
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist entries' },
      { status: 500 }
    );
  }
}

// POST /api/waitlist - Add a new waitlist entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists in waitlist
    const existingEntry = await db.query.waitlist.findFirst({
      where: eq(waitlist.email, body.email)
    });
    
    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered in waitlist' },
        { status: 409 }
      );
    }
    
    // Add to waitlist
    const now = new Date();
    const newEntry = await db.insert(waitlist)
      .values({
        email: body.email,
        submittedAt: now
      })
      .returning();
    
    return NextResponse.json(newEntry[0], { status: 201 });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}