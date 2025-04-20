import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { blogPosts } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/blog/[id] - Get a blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      );
    }
    
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id)
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update a blog post (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      );
    }
    
    // Check if the blog post exists
    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id)
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate fields - will be enhanced with zod later
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check slug uniqueness if it's changed
    if (body.slug && body.slug !== existingPost.slug) {
      const slugExists = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, body.slug)
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update the blog post
    const updatedPost = await db.update(blogPosts)
      .set({
        title: body.title,
        slug: body.slug || existingPost.slug,
        content: body.content,
        excerpt: body.excerpt,
        imageUrl: body.imageUrl || existingPost.imageUrl,
        // Only update publishedAt if explicitly provided
        ...(body.publishedAt && { publishedAt: body.publishedAt })
      })
      .where(eq(blogPosts.id, id))
      .returning();
    
    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete a blog post (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication - to be implemented later
    // const session = await getServerSession();
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID' },
        { status: 400 }
      );
    }
    
    // Check if the blog post exists
    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id)
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Delete the blog post
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}