import { Metadata } from 'next';
import { getAllBlogPosts, getPageContent } from '../lib/api';
import { BlogPost } from '../../shared/schema';

// Generate dynamic metadata for the blog page
export async function generateMetadata(): Promise<Metadata> {
  // Get any custom metadata from the page content
  const pageContent = await getPageContent('blog');
  
  // Use metadata helper to extract and combine with defaults
  const { extractMetadataFromContent, createMetadata } = await import('../lib/metadata');
  
  // First get any custom metadata from the page content
  const contentMetadata = extractMetadataFromContent(pageContent);
  
  // Then create blog-specific metadata
  return createMetadata('blog', {
    title: contentMetadata.title as string,
    description: contentMetadata.description as string
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

// Blog page component
export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest insights and thoughts on AI, technology, and business transformation.
          </p>
        </div>
        
        {blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post: BlogPost) => (
              <div key={post.id} className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 h-full">
                {post.imageUrl && (
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <p className="text-sm text-gray-500 mb-2">
                    {post.publishedAt ? formatDate(post.publishedAt) : 'Published recently'}
                  </p>
                  <h2 className="text-xl font-bold mb-3 text-gray-900">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <a 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 mt-auto"
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No blog posts available at the moment. Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}