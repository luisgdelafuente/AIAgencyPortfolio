import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoute, Link } from 'wouter';
import type { BlogPost } from '@shared/schema';
import { formatDate } from '@shared/utils';
import { ChevronLeft } from 'lucide-react';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`]
  });

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center">
            <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
            <p className="mb-6">The blog post you are looking for does not exist.</p>
            <Link href="/blog" className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
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
      <Helmet>
        <title>{post ? `${post.title} | HAL149` : 'Blog Post | HAL149'}</title>
        <meta name="description" content={post?.excerpt || 'HAL149 blog post'} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
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
              <div className="bg-neutral-50 py-8 sm:py-10 md:py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Link href="/blog" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to blog
                  </Link>
                  <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                  <div className="text-neutral-600">{formatDate(post.publishedAt)}</div>
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-auto rounded-lg mb-8"
                />
                <div className="prose max-w-none">
                  {/* In a real app, you would use a markdown renderer here */}
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
