import React, { useState, useEffect } from 'react';
import { CircleDot, Sparkles, BarChart3 } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

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

export default function Features() {
  const t = useTranslations();
  
  const [content, setContent] = useState<HomeContent>({
    featuresTitle: t.features.title,
    featuresSubtitle: t.features.subtitle,
    features: t.features.items
  });
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  // Default icons for features
  const featureIcons = [
    <CircleDot className="w-6 h-6" key="circle-dot" />,
    <Sparkles className="w-6 h-6" key="sparkles" />,
    <BarChart3 className="w-6 h-6" key="bar-chart" />
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        {(content.featuresTitle || content.featuresSubtitle) && (
          <div className="text-center mb-10">
            {content.featuresTitle && (
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {content.featuresTitle}
              </h2>
            )}
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
