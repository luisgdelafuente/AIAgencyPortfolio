'use client';

import React, { useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { BlogPost, PageContent } from '@shared/schema';
import BlogCard from '@/components/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import MetaTags from '@/components/MetaTags';
import { extractMetadata } from '@/lib/metadata';

export default function Blog() {
  // Fetch blog posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  // Fetch page metadata
  const { data: pageContent, isLoading: isLoadingContent } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/blog'],
  });

  // Extract metadata with defaults
  const metadata = extractMetadata(pageContent);

  // Parse the content
  const content = useMemo(() => {
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

  // Loading state with skeletons
  const isLoading = isLoadingPosts || isLoadingContent;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <Skeleton className="h-12 w-1/3 mx-auto" />
              <Skeleton className="h-6 w-2/3 mx-auto mt-4" />
            </div>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-lg">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 flex-grow">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
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
        url="https://hal149.com/blog/" 
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {content.blogTitle || 'Blog'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {content.blogSubtitle || 'Latest insights and updates from our team'}
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts && posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
              
              {/* Show "No posts" message if posts array is empty */}
              {posts && posts.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-xl text-gray-600">No blog posts available yet.</p>
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