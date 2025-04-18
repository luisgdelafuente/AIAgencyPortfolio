'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') {
      return true;
    }
    if (path !== '/' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap">HAL149</span>
          </Link>
        </div>
        
        <div className="flex md:order-2">
          <Link 
            href="/contact" 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Contact Us
          </Link>
        </div>
        
        <div className="hidden md:flex flex-col md:flex-row md:ml-auto md:mt-0 mt-3">
          <Link 
            href="/" 
            className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            Home
          </Link>
          <Link 
            href="/projects" 
            className={`px-3 py-2 text-sm font-medium ${isActive('/projects') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            Projects
          </Link>
          <Link 
            href="/blog" 
            className={`px-3 py-2 text-sm font-medium ${isActive('/blog') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            Blog
          </Link>
          <Link 
            href="/about" 
            className={`px-3 py-2 text-sm font-medium ${isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}