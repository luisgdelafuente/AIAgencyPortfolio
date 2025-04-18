'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui';
import {
  BarChart,
  FileText,
  FolderKanban,
  Layout,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const HAL149Logo = () => (
  <div className="flex items-center">
    <img src="/hallogoblack480.webp" alt="HAL149" className="h-9 sm:h-10 w-auto" />
  </div>
);

// Custom hook to detect mobile screens
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default function AdminNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <BarChart className="h-5 w-5 mr-2" /> },
    { href: '/admin/blog', label: 'Blog Posts', icon: <FileText className="h-5 w-5 mr-2" /> },
    { href: '/admin/projects', label: 'Projects', icon: <FolderKanban className="h-5 w-5 mr-2" /> },
    { href: '/admin/content', label: 'Page Content', icon: <Layout className="h-5 w-5 mr-2" /> },
    { href: '/admin/waitlist', label: 'Waitlist', icon: <Users className="h-5 w-5 mr-2" /> },
    { href: '/admin/messages', label: 'Contact Messages', icon: <MessageSquare className="h-5 w-5 mr-2" /> },
    { href: '/admin/settings', label: 'Site Settings', icon: <Settings className="h-5 w-5 mr-2" /> }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 mb-4">
        <Link href="/" className="inline-block">
          <HAL149Logo />
        </Link>
      </div>

      <nav className="space-y-1 p-2">
        {navItems.map(item => (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={`flex items-center px-4 py-2 rounded-md ${
              isActive(item.href) 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b p-4 flex items-center justify-between">
            <Link href="/" className="inline-block">
              <HAL149Logo />
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Mobile Sidebar (slides in) */}
          <div 
            className={`fixed inset-0 z-40 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out lg:hidden`}
          >
            <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative bg-white w-64 h-full overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
          
          {/* Content padding for mobile header */}
          <div className="h-16 lg:hidden"></div>
        </>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:w-64 lg:h-screen lg:bg-white lg:border-r">
        <SidebarContent />
      </div>
    </>
  );
}