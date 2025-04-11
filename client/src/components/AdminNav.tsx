import React, { useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  FileText, 
  FolderKanban, 
  LogOut, 
  Mail, 
  Settings, 
  Users 
} from 'lucide-react';
import { AuthContext, AuthContextType } from '@/App';
import { useToast } from '@/hooks/use-toast';

const HAL149Logo = () => (
  <svg className="h-8 w-auto" viewBox="0 0 120 40" fill="currentColor">
    <path d="M30,10 L30,30 M10,10 L10,30 M10,20 L30,20 M40,10 Q50,10 50,20 Q50,30 40,30" stroke="currentColor" strokeWidth="4" fill="none" />
    <text x="60" y="25" fontFamily="Arial" fontSize="15" fontWeight="bold">HAL149</text>
  </svg>
);

export default function AdminNav() {
  const [location] = useLocation();
  const auth = useContext(AuthContext);
  const { toast } = useToast();
  
  // Guard against auth being null
  if (!auth) {
    return (
      <div className="flex h-screen border-r border-neutral-200 w-64 p-6">
        <div>Loading navigation...</div>
      </div>
    );
  }
  
  const handleLogout = async () => {
    try {
      await auth.logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
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
            <div className="font-medium">{auth.user?.username || 'Admin'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
