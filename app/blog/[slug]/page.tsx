'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { BlogPost, PageContent } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { marked } from 'marked';
import MetaTags from '@/components/MetaTags';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@shared/utils';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Fetch the specific blog post
  const { data: post, isLoading: isLoadingPost } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
  });
  
  // Fetch page metadata (for default blog metadata)
  const { data: pageContent, isLoading: isLoadingContent } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/blog'],
  });
  
  // Loading state
  const isLoading = isLoadingPost || isLoadingContent;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-6" />
              
              <Skeleton className="h-64 w-full mb-8 rounded-lg" />
              
              <div className="space-y-4 prose prose-lg max-w-none">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Handle not found
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">The blog post you're looking for doesn't exist or may have been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Extract metadata (inherit from page content)
  const metadata = {
    title: post.title ? `${post.title} | HAL149` : undefined,
    description: post.excerpt,
    keywords: '',
    canonical: `https://hal149.com/blog/${post.slug}/`,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    ogImage: post.imageUrl
  };
  
  return (
    <>
      <MetaTags 
        metadata={metadata} 
        type="article"
        url={`https://hal149.com/blog/${post.slug}/`}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article>
              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h1>
                <p className="text-gray-600">
                  {formatDate(post.publishedAt)}
                </p>
              </header>
              
              {post.imageUrl && (
                <div className="mb-8">
                  <img 
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
              
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: marked.parse(post.content) 
                }}
              />
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}