import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { projects, users, type Project } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const allProjects = await db.query.projects.findMany({
      orderBy: (projectsTable) => [desc(projectsTable.id)]
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
    
    const body = await request.json();
    
    // Validate the request body
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
      githubUrl: body.githubUrl || null,
      demoUrl: body.demoUrl || null,
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