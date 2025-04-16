import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { useQuery } from '@tanstack/react-query';
import { PageContent } from '@shared/schema';
import { extractMetadata } from '@/lib/metadata';
import { Skeleton } from '@/components/ui/skeleton';

interface AboutContent {
  title?: string;
  subtitle?: string;
  content?: string;
  vision?: string;
  mission?: string;
  [key: string]: any;
}

export default function About() {
  const [content, setContent] = useState<AboutContent>({});
  
  // Fetch page content including metadata
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/about'],
  });
  
  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);
  
  useEffect(() => {
    if (pageContent?.content) {
      try {
        // Parse the JSON content
        const parsedContent = typeof pageContent.content === 'string' 
          ? JSON.parse(pageContent.content)
          : pageContent.content;
        setContent(parsedContent);
      } catch (error) {
        console.error('Error parsing about content JSON:', error);
        // If it's not JSON, assume it's HTML content
        setContent({
          content: pageContent.content
        });
      }
    }
  }, [pageContent]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-12"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
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
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            {content.title && (
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {content.title}
                </h1>
                {content.subtitle && (
                  <p className="text-lg text-gray-600">
                    {content.subtitle}
                  </p>
                )}
              </div>
            )}
            
            <div className="prose prose-gray max-w-none">
              {/* If there's a specific content field that contains HTML, render it */}
              {content.content && (
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              )}
              
              {/* Render any other JSON fields that might be useful */}
              {content.vision && (
                <div className="mb-10">
                  <p className="text-gray-600 leading-relaxed">
                    {content.vision}
                  </p>
                </div>
              )}
              
              {content.mission && (
                <div className="mb-10">
                  <p className="text-gray-600 leading-relaxed">
                    {content.mission}
                  </p>
                </div>
              )}
              
              {content.history && (
                <div className="mb-10">
                  <p className="text-gray-600 leading-relaxed">
                    {content.history}
                  </p>
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