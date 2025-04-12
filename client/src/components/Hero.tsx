import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="pt-40 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-gray-100 text-gray-900 border border-gray-200">
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Industry-Specific <br className="hidden sm:block" />
            <span className="text-gray-900">AI Applications</span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform data into insights, automate workflows, and stay ahead of the competition.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
            <Button asChild size="lg" className="px-8 py-6 bg-gray-900 hover:bg-black text-white text-lg rounded-lg font-medium shadow-sm">
              <Link href="/blog">Read Our Blog</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg rounded-lg border-2 border-gray-300 text-gray-800 hover:bg-gray-50 font-medium">
              <a href="#waitlist">Join Waitlist</a>
            </Button>
          </div>
          
          <div className="mt-24 text-sm text-gray-500 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enterprise-ready
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              99.9% uptime
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              24/7 support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
