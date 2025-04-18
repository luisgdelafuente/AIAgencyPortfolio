import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { blogPosts } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const posts = await db.query.blogPosts.findMany({
      orderBy: (posts, { desc }: { desc: any }) => [desc(posts.publishedAt)]
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
    // Check authentication - this will be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const body = await request.json();
    
    // Validate the request body
    // This will be improved with zod validation later
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
    const date = new Date().toISOString();
    const newPost = await db.insert(blogPosts).values({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      imageUrl: body.imageUrl,
      publishedAt: body.publishedAt || date
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