import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  FileText, 
  FolderKanban, 
  LogOut, 
  Users 
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const HAL149Logo = () => (
  <div className="flex items-center">
    <img src="/hallogoblack480.webp" alt="HAL149" className="h-7 w-auto" />
  </div>
);

export default function AdminNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          toast({
            title: "Logged out",
            description: "You have been successfully logged out"
          });
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
    { href: '/admin/dashboard', label: 'Dashboard', icon: <BarChart className="h-5 w-5 mr-2" /> },
    { href: '/admin/blog', label: 'Blog Posts', icon: <FileText className="h-5 w-5 mr-2" /> },
    { href: '/admin/projects', label: 'Projects', icon: <FolderKanban className="h-5 w-5 mr-2" /> },
    { href: '/admin/waitlist', label: 'Waitlist', icon: <Users className="h-5 w-5 mr-2" /> }
  ];

  return (
    <div className="flex h-screen border-r border-neutral-200">
      <div className="w-64 p-6">
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <HAL149Logo />
          </Link>
          <div className="mt-2 text-sm font-medium">Admin Panel</div>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.href} 
              href={item.href}
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

        <div className="absolute bottom-6 left-6 right-6 space-y-4">
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
    </div>
  );
}
