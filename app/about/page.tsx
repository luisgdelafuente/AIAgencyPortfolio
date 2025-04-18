'use client';

import React, { useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { PageContent } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import MetaTags from '@/components/MetaTags';
import { extractMetadata } from '@/lib/metadata';
import { marked } from 'marked';

export default function About() {
  // Fetch page content including metadata
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/about'],
  });

  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);
  
  // Parse the JSON content
  const content = useMemo(() => {
    if (!pageContent?.content) return {};
    
    try {
      return typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
    } catch (error) {
      console.error('Error parsing about page content JSON:', error);
      return {};
    }
  }, [pageContent]);

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <Skeleton className="h-12 w-1/3 mx-auto" />
              <Skeleton className="h-6 w-2/3 mx-auto mt-4" />
            </div>
            
            <div className="space-y-8">
              <Skeleton className="h-64 w-full rounded-lg" />
              
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              
              <Skeleton className="h-48 w-full rounded-lg" />
              
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
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
        url="https://hal149.com/about/"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {content.aboutTitle || 'About Us'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {content.aboutSubtitle || 'Learn more about our team and mission'}
              </p>
            </div>
            
            {content.aboutContent && (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: marked.parse(content.aboutContent)
                }}
              />
            )}
            
            {/* Show placeholder if no content */}
            {!content.aboutContent && (
              <div className="text-center py-10">
                <p className="text-xl text-gray-600">About page content coming soon.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}