import React from 'react';
import { CircleDot, Sparkles, BarChart3 } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { useQuery } from '@tanstack/react-query';
import { PageContent } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureContent {
  title: string;
  description: string;
}

interface HomeContent {
  featuresTitle?: string;
  featuresSubtitle?: string;
  features?: FeatureContent[];
  [key: string]: any;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200 flex flex-col">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// Skeleton version of FeatureCard for loading state
function FeatureCardSkeleton() {
  return (
    <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
      <Skeleton className="w-14 h-14 rounded-full mb-5" />
      <Skeleton className="h-6 w-1/2 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export default function Features() {
  const t = useTranslations();
  
  // Use React Query for data fetching (consistent with other components)
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/home'],
  });
  
  // Parse the content
  let content: HomeContent = {};
  if (pageContent?.content) {
    try {
      content = typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
    } catch (error) {
      console.error('Error parsing features content JSON:', error);
    }
  }

  // Default icons for features
  const featureIcons = [
    <CircleDot className="w-6 h-6" key="circle-dot" />,
    <Sparkles className="w-6 h-6" key="sparkles" />,
    <BarChart3 className="w-6 h-6" key="bar-chart" />
  ];

  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCardSkeleton />
            <FeatureCardSkeleton />
            <FeatureCardSkeleton />
          </div>
        </div>
      </section>
    );
  }
  
  // Don't render anything if no features
  if (!content.features || content.features.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        {content.featuresTitle && (
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {content.featuresTitle}
            </h2>
            {content.featuresSubtitle && (
              <p className="mt-4 text-lg text-gray-600">
                {content.featuresSubtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.features && content.features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={featureIcons[index % featureIcons.length]}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
