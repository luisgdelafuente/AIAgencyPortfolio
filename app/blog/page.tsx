import { fetchPageContent, fetchBlogPosts } from '../lib/api';
import { Metadata } from 'next';
import Link from 'next/link';
import { formatDate } from '@/shared/utils';

export const metadata: Metadata = {
  title: 'AI Blog - Next-Generation Insights | HAL149',
  description: 'Explore the latest advances in artificial intelligence, machine learning, and data insights from HAL149\'s research team.',
  keywords: 'AI blog, machine learning blog, artificial intelligence insights, HAL149 research',
};

// Parse content from string to JSON
const parseContent = (content: string | undefined) => {
  if (!content) return {};
  try {
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return {};
  }
};

export default async function Blog() {
  // Fetch data using server components
  const pageContentData = await fetchPageContent('blog');
  const blogPosts = await fetchBlogPosts();
  
  // Parse the page content
  const pageContent = parseContent(pageContentData?.content);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              {pageContent.blogTitle || 'AI Blog & Insights'}
            </h1>
            <p className="text-xl text-gray-300">
              {pageContent.blogSubtitle || 'Explore the latest advances in artificial intelligence and industry applications'}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts && blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
                  {post.imageUrl && (
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <time dateTime={post.publishedAt} className="text-sm text-gray-500">
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-gray-600 transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
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
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl font-medium text-gray-900 mb-2">No blog posts found</h2>
              <p className="text-gray-600">
                Check back soon for new content from our team!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {pageContent.ctaTitle || 'Want to Stay Updated?'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {pageContent.ctaText || 'Join our waitlist to receive the latest articles, news, and updates from our team.'}
          </p>
          <Link 
            href="#waitlist" 
            className="inline-flex items-center justify-center h-12 px-6 font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            {pageContent.ctaButton || 'Join Our Waitlist'}
          </Link>
        </div>
      </section>
    </div>
  );
}