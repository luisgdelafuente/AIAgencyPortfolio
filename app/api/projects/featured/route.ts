import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/projects/featured - Get featured projects
export async function GET(request: NextRequest) {
  try {
    const featuredProjects = await db.query.projects.findMany({
      where: eq(projects.isFeatured, true),
      orderBy: (projects, { desc }: { desc: any }) => [desc(projects.id)]
    });
    
    return NextResponse.json(featuredProjects);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured projects' },
      { status: 500 }
    );
  }
}