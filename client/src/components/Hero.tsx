import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-2 text-neutral-500">
          <span className="bg-neutral-100 px-3 py-1 rounded-full text-sm">Coming Soon</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Industry-Specific AI Applications
        </h1>
        <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Transform data into insights, automate workflows, and stay ahead of the competition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-black text-white hover:bg-neutral-800">
            <Link href="/blog">Read Our Blog</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white text-black border-neutral-300 hover:bg-neutral-100">
            <a href="#waitlist">Join Waitlist</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
