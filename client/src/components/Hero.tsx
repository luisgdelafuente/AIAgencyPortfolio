import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="pt-32 pb-16 bg-white">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-1 mb-6 rounded-full bg-gray-100 text-gray-900">
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
            Industry-Specific <span className="text-gray-900">AI Applications</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Transform data into insights, automate workflows, and stay ahead of the competition.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-6 py-3 bg-black text-white rounded-md font-medium">
              <Link href="/blog">Read Our Blog</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:border-gray-400">
              <a href="#waitlist">Join Waitlist</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
