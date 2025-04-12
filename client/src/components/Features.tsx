import React from 'react';
import { CircleDot, Sparkles, BarChart3 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
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
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our AI-powered platform offers these powerful capabilities
          </p>
        </div>
        
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
