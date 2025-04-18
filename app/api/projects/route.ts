import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const allProjects = await db.query.projects.findMany({
      orderBy: (projects, { desc }) => [desc(projects.id)]
    });
    
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project (protected)
export async function POST(request: NextRequest) {
  try {
    // Check authentication - this will be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const body = await request.json();
    
    // Validate the request body
    // This will be improved with zod validation later
    if (!body.title || !body.slug || !body.description || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existing = await db.query.projects.findFirst({
      where: eq(projects.slug, body.slug)
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Create the project
    const newProject = await db.insert(projects).values({
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: body.content,
      category: body.category || 'Other',
      imageUrl: body.imageUrl || '',
      isFeatured: body.isFeatured || false
    }).returning();
    
    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}