import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { blogPosts } from '@/shared/schema';
import { eq } from 'drizzle-orm';

// GET /api/blog/[slug] - Get a blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid blog post slug' },
        { status: 400 }
      );
    }
    
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug)
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}