import { fetchBlogPosts } from '../../lib/api';
import { formatDate } from '@shared/utils';
import { marked } from 'marked';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { slug: string }
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch all blog posts and find the one with matching slug
  const posts = await fetchBlogPosts();
  const post = posts.find(post => post.slug === params.slug);
  
  // If no post is found, return default metadata
  if (!post) {
    return {
      title: 'Blog Post Not Found | HAL149',
      description: 'The requested blog post could not be found.',
    };
  }
  
  // Return metadata based on the post
  return {
    title: `${post.title} | HAL149`,
    description: post.excerpt,
    keywords: `${post.title}, HAL149 blog, AI insights`,
    openGraph: {
      title: `${post.title} | HAL149`,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : undefined,
      type: 'article',
      url: `https://hal149.com/blog/${post.slug}/`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | HAL149`,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
    alternates: {
      canonical: `https://hal149.com/blog/${post.slug}/`,
    }
  };
}

export default async function BlogPost({ params }: Props) {
  // Fetch all blog posts
  const posts = await fetchBlogPosts();
  
  // Find the post with matching slug
  const post = posts.find(post => post.slug === params.slug);
  
  // If post doesn't exist, show a not found message
  if (!post) {
    return (
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center justify-center h-12 px-6 font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (exclude current post and limit to 3)
  const relatedPosts = posts
    .filter(p => p.id !== post.id)
    .slice(0, 3);
    
  return (
    <div className="bg-white">
      {/* Hero Section with Featured Image */}
      <section className="relative bg-gray-900 text-white">
        {post.imageUrl && (
          <div className="absolute inset-0 opacity-40">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="mb-4 text-gray-300">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ 
                __html: marked.parse(post.content, { sanitize: false })
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
                  {relatedPost.imageUrl && (
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <time dateTime={relatedPost.publishedAt} className="text-sm text-gray-500">
                        {formatDate(relatedPost.publishedAt)}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-gray-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600"
                    >
                      Read Article
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link 
                href="/blog" 
                className="inline-flex items-center justify-center h-12 px-6 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}