import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";
import { useQuery } from '@tanstack/react-query';
import BlogCard from '@/components/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost } from '@shared/schema';

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog']
  });

  return (
    <>
      <Helmet>
        <title>Blog | HAL149</title>
        <meta name="description" content="Read the latest insights and articles about artificial intelligence and machine learning." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <section className="bg-neutral-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Our Blog
              </h1>
              <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto">
                Insights and updates from the cutting edge of AI technology
              </p>
            </div>
          </section>
          
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {isLoading ? (
                  // Skeleton loaders while data is loading
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <Skeleton className="w-full h-48" />
                      <div className="p-6">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  ))
                ) : posts && posts.length > 0 ? (
                  // Display posts
                  posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-neutral-500">No blog posts available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
