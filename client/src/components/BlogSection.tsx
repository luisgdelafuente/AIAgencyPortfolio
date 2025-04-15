import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from './BlogCard';
import type { BlogPost } from '@shared/schema';
import { useTranslations } from '@/hooks/use-translations';

interface HomeContent {
  blogTitle?: string;
  blogSubtitle?: string;
  blogCta?: string;
  [key: string]: any;
}

export default function BlogSection() {
  const t = useTranslations();
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog']
  });
  
  const [content, setContent] = useState<HomeContent>({
    blogTitle: '',
    blogSubtitle: '',
    blogCta: ''
  });
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/page-contents/home');
        if (response.ok) {
          const data = await response.json();
          // Handle both string and object formats
          if (typeof data.content === 'string') {
            try {
              const parsedContent = JSON.parse(data.content);
              setContent(parsedContent);
            } catch (e) {
              console.error('Error parsing JSON content:', e);
            }
          } else if (typeof data.content === 'object') {
            setContent(data.content);
          }
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };
    
    fetchContent();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {content.blogTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {content.blogSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders while data is loading
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-3 w-1/4 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
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
              <p className="text-gray-500">{t.blog.noPosts}</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="px-6 py-3 border-gray-300 hover:border-gray-400 text-gray-900 rounded-lg bg-white">
            <Link href="/blog/">{content.blogCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
