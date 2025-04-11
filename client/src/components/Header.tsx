import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const HAL149Logo = () => (
  <svg className="h-8 w-auto" viewBox="0 0 120 40" fill="currentColor">
    <path d="M30,10 L30,30 M10,10 L10,30 M10,20 L30,20 M40,10 Q50,10 50,20 Q50,30 40,30" stroke="currentColor" strokeWidth="4" fill="none" />
    <text x="60" y="25" fontFamily="Arial" fontSize="15" fontWeight="bold">HAL149</text>
  </svg>
);

export default function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/legal', label: 'Legal' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" aria-label="HAL149 home">
              <HAL149Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-neutral-600 hover:text-neutral-900 transition-colors ${
                  isActive(link.href) ? 'font-medium text-neutral-900' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
              <Globe className="h-4 w-4 mr-2" /> EN
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 mt-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-neutral-600 hover:text-neutral-900 transition-colors ${
                        isActive(link.href) ? 'font-medium text-neutral-900' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900 justify-start px-0">
                    <Globe className="h-4 w-4 mr-2" /> EN
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
