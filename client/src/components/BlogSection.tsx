import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from './BlogCard';
import type { BlogPost } from '@shared/schema';

export default function BlogSection() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog']
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Latest from Our Blog</h2>
          <p className="mt-4 text-gray-600">
            Stay updated with the latest insights in AI and technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders while data is loading
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded overflow-hidden border border-gray-100">
                <Skeleton className="w-full h-44" />
                <div className="p-4">
                  <Skeleton className="h-3 w-1/4 mb-1" />
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-full mb-3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))
          ) : blogPosts && blogPosts.length > 0 ? (
            // Display up to 3 blog posts
            blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500 text-sm">No blog posts available yet.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="link" className="text-black text-sm font-normal p-0 h-auto">
            <Link href="/blog" className="inline-flex items-center">
              View All Posts
              <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
