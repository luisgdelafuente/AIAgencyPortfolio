import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Globe, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const HAL149Logo = () => (
  <div className="flex items-center">
    <img src="/hallogoblack480.webp" alt="HAL149" className="h-8 w-auto" />
  </div>
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
    <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 py-1">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity" aria-label="HAL149 home">
              <HAL149Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium ${
                  isActive(link.href) 
                    ? 'text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 transition-colors duration-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pl-2 border-l border-gray-200">
              <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium">
                <Globe className="h-4 w-4 mr-1.5" /> EN
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-lg">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] border-l border-gray-200">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-base font-medium ${
                        isActive(link.href) 
                          ? 'text-gray-900' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 mt-2 border-t border-gray-200">
                    <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:text-gray-900 justify-start px-0 font-medium">
                      <Globe className="h-4 w-4 mr-1.5" /> English
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
