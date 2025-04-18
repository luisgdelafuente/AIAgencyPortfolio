import { Metadata } from 'next';
import { getAllBlogPosts, getBlogPostBySlug } from '../../lib/api';
import { notFound } from 'next/navigation';
import NextHead from '../../components/next-head';

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for blog posts
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | HAL149',
    };
  }
  
  // Use metadata helper to create blog post specific metadata
  const { createMetadata } = await import('../../lib/metadata');
  
  return createMetadata('blog', {
    title: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    slug: post.slug,
    canonical: `https://hal149.com/blog/${post.slug}`
  });
}

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Blog post page component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="py-12">
      <NextHead
        title={`${post.title} | HAL149`}
        description={post.excerpt || ''}
        keywords={post.keywords || 'blog, article, ai agency'}
        canonical={`https://hal149.com/blog/${post.slug}`}
        ogTitle={post.title}
        ogDescription={post.excerpt || ''}
        ogImage={post.imageUrl || ''}
        ogType="article"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-gray-500 mb-2">
            {post.publishedAt ? formatDate(post.publishedAt) : 'Published recently'}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
          
          {post.imageUrl && (
            <div className="mt-6 mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="mb-6 text-gray-500 italic border-l-4 border-gray-300 pl-4">
            {post.excerpt}
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {/* 
            Using dangerouslySetInnerHTML is not ideal for security, but for a 
            controlled admin environment it's acceptable. In a production app,
            you might want to use a proper markdown or rich text renderer.
          */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <a 
            href="/blog" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all blog posts
          </a>
        </div>
      </div>
    </div>
  );
}