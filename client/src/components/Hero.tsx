import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-4 text-gray-500">
          <span className="text-sm">Coming Soon</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-5">
          Industry-Specific AI Applications
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-base">
          Transform data into insights, automate workflows, and stay ahead
          <br />of the competition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="default" className="bg-black text-white hover:bg-neutral-800 rounded">
            <Link href="/blog">Read Our Blog</Link>
          </Button>
          <Button asChild variant="outline" size="default" className="text-black border-gray-200 hover:bg-gray-50 rounded">
            <a href="#waitlist">Join Waitlist</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
