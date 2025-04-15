import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';

interface HeroContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta?: string;
  featuresTitle?: string;
  featuresSubtitle?: string;
  [key: string]: any;
}

export default function Hero() {
  const t = useTranslations();
  const [content, setContent] = useState<HeroContent>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/page-contents/home');
        if (response.ok) {
          const data = await response.json();
          // Handle both JSON string and object formats
          if (typeof data.content === 'string') {
            try {
              const parsedContent = JSON.parse(data.content);
              setContent(parsedContent);
            } catch (e) {
              console.error('Error parsing JSON content:', e);
              // Don't set fallback content on error
            }
          } else if (typeof data.content === 'object') {
            // Content is already an object (JSONB from Supabase)
            setContent(data.content);
          }
        }
      } catch (error) {
        console.log('Error fetching home content:', error);
        // Don't set fallback content on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  // Don't render anything while loading to prevent flashing content
  if (loading) {
    return (
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-40"></div> {/* Placeholder height */}
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
