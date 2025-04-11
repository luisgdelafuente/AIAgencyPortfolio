import React from 'react';
import { BrainCircuit, Zap, LineChart } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200 card-hover">
      <div className="text-neutral-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-600">
        {description}
      </p>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: <BrainCircuit className="w-10 h-10" />,
      title: "Smart AI Models",
      description: "State-of-the-art machine learning models tailored for your specific industry needs."
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Instant Inference",
      description: "Lightning-fast processing with optimized inference pipelines for real-time results."
    },
    {
      icon: <LineChart className="w-10 h-10" />,
      title: "Data-Driven Insights",
      description: "Transform raw data into actionable business intelligence for smarter decision-making."
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
