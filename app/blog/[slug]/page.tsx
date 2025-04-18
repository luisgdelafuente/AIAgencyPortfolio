import { Metadata } from 'next';
import { getBlogPostBySlug, getPageContent } from '../../lib/api';
import { notFound } from 'next/navigation';

// Generate static params for all blog posts (for static generation)
export async function generateStaticParams() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`);
  const posts = await response.json();
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | HAL149',
    };
  }
  
  return {
    title: `${post.title} | HAL149 Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | HAL149 Blog`,
      description: post.excerpt,
      type: 'article',
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

// Blog post page component
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // Format date
  const publishDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <main>
      <article>
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-64 object-cover mb-8"
          />
        )}
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8">Published on {publishDate}</p>
        
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}