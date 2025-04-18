import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { blogPosts, users, type BlogPost } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const posts = await db.query.blogPosts.findMany({
      orderBy: (blogPosts: typeof blogPosts) => [desc(blogPosts.publishedAt)]
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog post (protected)
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
    if (!body.title || !body.slug || !body.content || !body.excerpt || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, body.slug)
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Create the blog post
    const date = new Date();
    const newPost = await db.insert(blogPosts).values({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      imageUrl: body.imageUrl,
      publishedAt: body.publishedAt || date.toISOString()
    }).returning();
    
    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}