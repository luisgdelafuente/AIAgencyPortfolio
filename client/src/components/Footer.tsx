import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const HAL149Logo = () => (
  <div className="flex items-center">
    <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5v14M19 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span className="font-bold text-lg">HAL149</span>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-3">
              <HAL149Logo />
            </div>
            <p className="text-gray-600 text-sm">
              Empowering the future with intelligent solutions.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 text-sm hover:text-gray-900">About</Link></li>
              <li><Link href="/blog" className="text-gray-600 text-sm hover:text-gray-900">Blog</Link></li>
              <li><Link href="/legal" className="text-gray-600 text-sm hover:text-gray-900">Legal</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 text-sm hover:text-gray-900">Documentation</a></li>
              <li><a href="#" className="text-gray-600 text-sm hover:text-gray-900">API Reference</a></li>
              <li><a href="#" className="text-gray-600 text-sm hover:text-gray-900">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Language</h3>
            <Button variant="ghost" size="sm" className="text-gray-600 text-sm hover:text-gray-900 p-0 h-auto">
              <Globe className="h-4 w-4 mr-1" /> English
            </Button>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <p className="text-gray-500 text-xs">
            © 2025 HAL149. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
