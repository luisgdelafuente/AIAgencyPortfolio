import React, { useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { useQuery } from '@tanstack/react-query';
import BlogCard from '@/components/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost, PageContent } from '@shared/schema';
import { extractMetadata } from '@/lib/metadata';

interface BlogContent {
  blogTitle?: string;
  blogSubtitle?: string;
  [key: string]: any; // For metadata and other fields
}

export default function Blog() {
  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog']
  });
  
  // Fetch the blog page metadata
  const { data: pageContent, isLoading: contentLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/blog'],
  });
  
  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);
  
  // Parse the JSON content
  const content = useMemo<BlogContent>(() => {
    if (!pageContent?.content) return {};
    
    try {
      return typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
    } catch (error) {
      console.error('Error parsing blog page content JSON:', error);
      return {};
    }
  }, [pageContent]);
  
  const isLoading = postsLoading || contentLoading;

  return (
    <>
      <MetaTags 
        metadata={metadata} 
        url="https://hal149.com/blog/"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              {contentLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-12"></div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    {content.blogTitle || ''}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {content.blogSubtitle || ''}
                  </p>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {isLoading ? (
                // Skeleton loaders while data is loading
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6">
                      <Skeleton className="h-4 w-1/4 mb-3" />
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500">No blog posts available yet.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}