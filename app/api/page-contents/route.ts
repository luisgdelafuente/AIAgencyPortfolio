import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { pageContents } from '@/shared/schema';

// GET /api/page-contents - Get all page contents
export async function GET(request: NextRequest) {
  try {
    const contents = await db.query.pageContents.findMany({
      orderBy: (contents, { asc }) => [asc(contents.page)]
    });
    
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching page contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page contents' },
      { status: 500 }
    );
  }
}