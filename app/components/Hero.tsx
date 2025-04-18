'use client';

import React from 'react';
import { Button, Skeleton } from '../components/ui';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

export default function Hero({ content = {}, isLoading = false }: { content?: any; isLoading?: boolean }) {
  const t = useTranslations();
  
  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-gray-900 text-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-80 bg-gray-800" />
            <Skeleton className="h-12 w-64 bg-gray-800 mt-2" />
            <Skeleton className="h-4 w-full bg-gray-800 mt-6" />
            <Skeleton className="h-4 w-5/6 bg-gray-800 mt-2" />
            <Skeleton className="h-4 w-4/6 bg-gray-800 mt-2" />
            <div className="mt-8 flex gap-4">
              <Skeleton className="h-10 w-32 bg-gray-800" />
              <Skeleton className="h-10 w-32 bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
        <div className="max-w-3xl">
          <h1 className="block text-4xl font-bold sm:text-5xl lg:text-6xl">
            {content.heroTitle || t.hero.title}
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            {content.heroSubtitle || t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href="#waitlist">
                {content.heroPrimaryText || t.hero.cta}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-gray-800">
              <Link href="/blog" className="inline-flex items-center">
                {content.heroSecondaryText || t.hero.readBlog}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Optional background pattern */}
      <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCAxMCkiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBzdHJva2U9IiMwMDAiIHN0cm9rZS1vcGFjaXR5PSIuMDUiIHN0cm9rZS13aWR0aD0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-5 z-0" aria-hidden="true">
      </div>
    </div>
  );
}