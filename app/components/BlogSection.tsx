'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from './BlogCard';
import type { BlogPost } from '@shared/schema';
import { useTranslations } from '../hooks/use-translations';

interface BlogSectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

export default function BlogSection({ posts, isLoading = false }: BlogSectionProps) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-64 mx-auto mb-3" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Skeleton className="h-10 w-36 mx-auto" />
          </div>
        </div>
      </section>
    );
  }
  
  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.blog.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.blog.subtitle}</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">{t.blog.noPosts}</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.blog.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.blog.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog" className="inline-flex items-center">
              {t.blog.cta}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}