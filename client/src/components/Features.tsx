import React from 'react';
import { CircleDot, Sparkles, BarChart3 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded shadow-sm">
      <div className="text-gray-500 mb-5">
        {icon}
      </div>
      <h3 className="text-base font-medium mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: <CircleDot className="w-6 h-6" />,
      title: "Smart AI Models",
      description: "State-of-the-art machine learning models tailored for your specific needs."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Instant Inference",
      description: "Lightning-fast processing with optimized inference pipelines."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Data-Driven Insights",
      description: "Transform raw data into actionable business intelligence."
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
