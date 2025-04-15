import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoute, Link } from 'wouter';
import type { BlogPost, PageContent } from '@shared/schema';
import { formatDate } from '@shared/utils';
import { ChevronLeft } from 'lucide-react';
import { extractMetadata, extractItemMetadata } from '@/lib/metadata';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';

  // Fetch blog post
  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`]
  });
  
  // Fetch blog page metadata (parent)
  const { data: blogPageContent } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/blog'],
  });
  
  // Extract metadata with inheritance
  // 1. Start with defaults
  // 2. Apply blog page metadata (parent)
  // 3. Apply blog post specific metadata (child)
  const postMetadata = post ? extractItemMetadata(post) : {};
  const metadata = extractMetadata(blogPageContent, null, postMetadata);
  
  // Create URL for canonical link and sharing
  const url = post?.slug ? `https://hal149.com/blog/${post.slug}/` : '';

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
            <p className="mb-6">The blog post you are looking for does not exist.</p>
            <Link href="/blog/" className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        metadata={metadata}
        type="article"
        url={url}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-16">
          {isLoading ? (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-6" />
              <Skeleton className="h-64 w-full mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : post ? (
            <>
              <div className="bg-neutral-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Link href="/blog/" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to blog
                  </Link>
                  <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                  <div className="text-neutral-600">{formatDate(post.publishedAt)}</div>
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-auto rounded-lg mb-6"
                />
                <div className="prose max-w-none">
                  {/* Handle both direct HTML and JSON-wrapped content */}
                  <div dangerouslySetInnerHTML={{ 
                    __html: (() => {
                      try {
                        // Try to parse as JSON first
                        if (typeof post.content === 'string' && post.content.trim().startsWith('{')) {
                          const contentObj = JSON.parse(post.content);
                          // If it has a content field, use that
                          if (contentObj.content) {
                            return contentObj.content;
                          }
                        }
                      } catch (e) {
                        // If parsing fails, just use the raw content
                      }
                      // Default case: use the content as-is
                      return post.content;
                    })()
                  }} />
                </div>
              </div>
            </>
          ) : null}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
