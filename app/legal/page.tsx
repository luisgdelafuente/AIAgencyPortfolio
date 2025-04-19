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

export default function Legal() {
  // Fetch page content including metadata
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/legal'],
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
      console.error('Error parsing legal page content JSON:', error);
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
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
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
        url="https://hal149.com/legal/"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {content.legalTitle || 'Legal Information'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {content.legalSubtitle || 'Terms of Service, Privacy Policy, and other legal information'}
              </p>
            </div>
            
            {/* Terms of Service */}
            {content.termsOfService && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked.parse(content.termsOfService)
                  }}
                />
              </div>
            )}
            
            {/* Privacy Policy */}
            {content.privacyPolicy && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked.parse(content.privacyPolicy)
                  }}
                />
              </div>
            )}
            
            {/* Cookie Policy */}
            {content.cookiePolicy && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Cookie Policy</h2>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked.parse(content.cookiePolicy)
                  }}
                />
              </div>
            )}
            
            {/* Show placeholder if no content */}
            {!content.termsOfService && !content.privacyPolicy && !content.cookiePolicy && (
              <div className="text-center py-10">
                <p className="text-xl text-gray-600">Legal information coming soon.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}