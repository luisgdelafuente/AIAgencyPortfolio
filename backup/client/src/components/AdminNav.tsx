import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  FileText, 
  FolderKanban, 
  LogOut, 
  Users,
  Menu,
  X,
  Layout,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const HAL149Logo = () => (
  <div className="flex items-center">
    <img src="/hallogoblack480.webp" alt="HAL149" className="h-9 sm:h-10 w-auto" />
  </div>
);

export default function AdminNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          toast({
            title: "Logged out",
            description: "You have been successfully logged out"
          });
          if (isMobile) {
            setSidebarOpen(false);
          }
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to log out. Please try again.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isActive = (path: string) => location === path;

  const navItems = [
    { href: '/admin/dashboard/', label: 'Dashboard', icon: <BarChart className="h-5 w-5 mr-2" /> },
    { href: '/admin/blog/', label: 'Blog Posts', icon: <FileText className="h-5 w-5 mr-2" /> },
    { href: '/admin/projects/', label: 'Projects', icon: <FolderKanban className="h-5 w-5 mr-2" /> },
    { href: '/admin/content/', label: 'Page Content', icon: <Layout className="h-5 w-5 mr-2" /> },
    { href: '/admin/waitlist/', label: 'Waitlist', icon: <Users className="h-5 w-5 mr-2" /> },
    { href: '/admin/messages/', label: 'Contact Messages', icon: <MessageSquare className="h-5 w-5 mr-2" /> },
    { href: '/admin/settings/', label: 'Site Settings', icon: <Settings className="h-5 w-5 mr-2" /> }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <Link href="/" className="inline-block">
          <HAL149Logo />
        </Link>
      </div>

      <nav className="space-y-1">
        {navItems.map(item => (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={`flex items-center px-4 py-2 rounded-md ${
              isActive(item.href) 
                ? 'bg-neutral-100 text-neutral-900 font-medium' 
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-neutral-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
        <div className="px-4 py-2 bg-neutral-50 rounded-md text-sm">
          <div className="text-neutral-500">Logged in as</div>
          <div className="font-medium">{user?.username || 'Admin'}</div>
        </div>
      </div>
    </div>
  );

  // Mobile view
  if (isMobile) {
    return (
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 bg-white z-30 border-b border-neutral-200 p-4 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <HAL149Logo />
          </Link>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6 w-72">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="h-[60px]"></div> {/* Spacer for fixed header */}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="hidden lg:block h-screen border-r border-neutral-200 fixed">
      <div className="w-64 p-6 flex flex-col h-full">
        <SidebarContent />
      </div>
    </div>
  );
}
