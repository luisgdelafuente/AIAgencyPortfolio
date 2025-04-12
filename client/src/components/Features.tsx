import React from 'react';
import { CircleDot, Sparkles, BarChart3 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-900">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
