import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects, type Project } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/projects/featured - Get featured projects
export async function GET(request: NextRequest) {
  try {
    const featuredProjects = await db.query.projects.findMany({
      where: eq(projects.isFeatured, true),
      orderBy: (projectsTable) => [desc(projectsTable.id)]
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