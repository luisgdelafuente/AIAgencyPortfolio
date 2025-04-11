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
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Stay updated with the latest insights in AI and technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders while data is loading
            Array(3).fill(0).map((_, i) => (
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
          ) : blogPosts && blogPosts.length > 0 ? (
            // Display up to 3 blog posts
            blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-neutral-500">No blog posts available yet.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="ghost" className="text-black hover:text-neutral-600">
            <Link href="/blog" className="inline-flex items-center">
              View All Posts
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
