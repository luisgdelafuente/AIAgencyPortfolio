'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, FileText, PenTool, Settings, Mail, List, LogOut } from 'lucide-react';

export default function AdminNav() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin';
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex flex-col h-full border-r">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your website content</p>
      </div>
      <nav className="space-y-1 px-2 flex-1">
        <Link href="/admin/dashboard" passHref>
          <Button
            variant={isActive('/admin/dashboard') ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </Button>
        </Link>
        <Link href="/admin/blog" passHref>
          <Button
            variant={isActive('/admin/blog') ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <div className="flex items-center space-x-3">
              <PenTool className="h-5 w-5" />
              <span>Blog Posts</span>
            </div>
          </Button>
        </Link>
        <Link href="/admin/projects" passHref>
          <Button
            variant={isActive('/admin/projects') ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>Projects</span>
            </div>
          </Button>
        </Link>
        <Link href="/admin/content" passHref>
          <Button
            variant={isActive('/admin/content') ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5" />
              <span>Page Content</span>
            </div>
          </Button>
        </Link>
        <Link href="/admin/messages" passHref>
          <Button
            variant={isActive('/admin/messages') ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <span>Messages</span>
            </div>
          </Button>
        </Link>
        <Link href="/admin/waitlist" passHref>
          <Button
            variant={isActive('/admin/waitlist') ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <div className="flex items-center space-x-3">
              <List className="h-5 w-5" />
              <span>Waitlist</span>
            </div>
          </Button>
        </Link>
      </nav>
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}