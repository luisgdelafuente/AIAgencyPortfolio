import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/projects/slug/[slug] - Get a project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid project slug' },
        { status: 400 }
      );
    }
    
    const project = await db.query.projects.findFirst({
      where: eq(projects.slug, slug)
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}