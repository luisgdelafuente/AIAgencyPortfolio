import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../server/db';
import { pageContents } from '../../../../shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/page-contents/[page] - Get page content by page name
export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    // In Next.js App Router, dynamic params need to be properly awaited
    const page = params.page;
    
    if (!page) {
      return NextResponse.json(
        { error: 'Invalid page name' },
        { status: 400 }
      );
    }
    
    const content = await db.query.pageContents.findFirst({
      where: eq(pageContents.page, page)
    });
    
    if (!content) {
      return NextResponse.json(
        { error: 'Page content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    );
  }
}

// PUT /api/page-contents/[page] - Update page content (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // In Next.js App Router, dynamic params need to be properly awaited
    const page = params.page;
    
    if (!page) {
      return NextResponse.json(
        { error: 'Invalid page name' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    if (!body.content) {
      return NextResponse.json(
        { error: 'Missing content' },
        { status: 400 }
      );
    }
    
    // Check if the page content exists
    const existingContent = await db.query.pageContents.findFirst({
      where: eq(pageContents.page, page)
    });
    
    const now = new Date().toISOString();
    
    if (existingContent) {
      // Update existing content
      const updatedContent = await db.update(pageContents)
        .set({
          content: body.content,
          updatedAt: now
        })
        .where(eq(pageContents.page, page))
        .returning();
      
      return NextResponse.json(updatedContent[0]);
    } else {
      // Create new content
      const newContent = await db.insert(pageContents)
        .values({
          page,
          content: body.content,
          updatedAt: now
        })
        .returning();
      
      return NextResponse.json(newContent[0], { status: 201 });
    }
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      { error: 'Failed to update page content' },
      { status: 500 }
    );
  }
}