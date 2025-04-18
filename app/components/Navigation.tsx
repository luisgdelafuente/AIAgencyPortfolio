'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600' : 'text-gray-800 hover:text-primary-600';
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-gray-900">
                HAL149
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8 md:items-center">
              <Link href="/" className={`${isActive('/')} text-sm font-medium transition-colors`}>
                Home
              </Link>
              <Link href="/about" className={`${isActive('/about')} text-sm font-medium transition-colors`}>
                About
              </Link>
              <Link href="/projects" className={`${isActive('/projects')} text-sm font-medium transition-colors`}>
                Projects
              </Link>
              <Link href="/blog" className={`${isActive('/blog')} text-sm font-medium transition-colors`}>
                Blog
              </Link>
              <Link href="/contact" className={`${isActive('/contact')} text-sm font-medium transition-colors`}>
                Contact
              </Link>
            </nav>
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/"
              className={`${pathname === '/' ? 'bg-gray-100 text-primary-600' : 'text-gray-800 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${pathname === '/about' ? 'bg-gray-100 text-primary-600' : 'text-gray-800 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/projects"
              className={`${pathname === '/projects' ? 'bg-gray-100 text-primary-600' : 'text-gray-800 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className={`${pathname === '/blog' ? 'bg-gray-100 text-primary-600' : 'text-gray-800 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`${pathname === '/contact' ? 'bg-gray-100 text-primary-600' : 'text-gray-800 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}