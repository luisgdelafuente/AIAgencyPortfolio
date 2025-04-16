import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { PageContent } from '@shared/schema';

interface HeroContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta?: string;
  blogCta?: string;
  comingSoon?: string;
  featuresTitle?: string;
  featuresSubtitle?: string;
  [key: string]: any;
}

export default function Hero() {
  const t = useTranslations();
  
  // Get content from the API using React Query instead of useEffect
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/home'],
  });
  
  // Parse the content
  let content: HeroContent = {};
  if (pageContent?.content) {
    try {
      content = typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
    } catch (error) {
      console.error('Error parsing JSON content:', error);
    }
  }
  
  // Loading state with skeletons
  if (isLoading) {
    return (
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col items-center gap-6">
              <Skeleton className="h-12 w-3/4 max-w-2xl" />
              <Skeleton className="h-4 w-1/2 max-w-xl" />
              <div className="flex gap-4 mt-8">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="pt-32 pb-16 bg-white">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {content.comingSoon && (
            <div className="inline-flex items-center justify-center px-4 py-1 mb-6 rounded-full bg-gray-100 text-gray-900">
              <span className="text-sm font-medium">{content.comingSoon}</span>
            </div>
          )}
          {content.heroTitle && (
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              {content.heroTitle.split(' ').length > 2 
                ? <>
                    {content.heroTitle.split(' ').slice(0, -2).join(' ')} <span className="text-gray-900">{content.heroTitle.split(' ').slice(-2).join(' ')}</span>
                  </>
                : content.heroTitle
              }
            </h1>
          )}
          {content.heroSubtitle && (
            <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              {content.heroSubtitle}
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-6 py-3 bg-black text-white rounded-md font-medium">
              <Link href="/blog/">{content.blogCta || t.hero.readBlog}</Link>
            </Button>
            {content.heroCta && (
              <Button asChild variant="outline" size="lg" className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:border-gray-400">
                <a href="#waitlist">{content.heroCta}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
