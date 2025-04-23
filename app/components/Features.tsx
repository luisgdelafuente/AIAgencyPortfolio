'use client';

import React from 'react';
import { CircleDot, Sparkles, BarChart3 } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { Skeleton } from '../components/ui';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function Features({ content = {}, isLoading = false }: { content?: any; isLoading?: boolean }) {
  const t = useTranslations();
  
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-3" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-white rounded-lg border border-gray-100">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default features from translations
  const defaultFeatures = (t.home?.features?.items) || [
    {
      title: 'Smart AI Models',
      description: 'State-of-the-art machine learning models tailored for your specific needs.'
    },
    {
      title: 'Instant Inference',
      description: 'Lightning-fast processing with optimized inference pipelines.'
    },
    {
      title: 'Data-Driven Insights',
      description: 'Transform raw data into actionable business intelligence.'
    }
  ];

  // Icons for features
  const featureIcons = [
    <CircleDot key="ai" className="h-6 w-6 text-gray-600" />,
    <Sparkles key="inference" className="h-6 w-6 text-gray-600" />,
    <BarChart3 key="data" className="h-6 w-6 text-gray-600" />
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {content.featuresTitle || t.home?.features?.title || "Our Services"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.featuresSubtitle || t.home?.features?.subtitle || "Cutting-edge AI solutions for your business"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaultFeatures.map((feature: any, index: number) => (
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