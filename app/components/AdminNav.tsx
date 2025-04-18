"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Settings, MessageCircle, 
  FileText, Folder, Users, LogOut
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui";

export function AdminNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">HAL149 Admin</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/admin"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/blog"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/blog") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>Blog</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/projects"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/projects") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <Folder className="mr-2 h-5 w-5" />
              <span>Projects</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/content"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/content") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <FileText className="mr-2 h-5 w-5" />
              <span>Page Content</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/messages"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/messages") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/waitlist"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/waitlist") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <Users className="mr-2 h-5 w-5" />
              <span>Waitlist</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/settings"
              className={`flex items-center p-2 rounded-md ${
                isActive("/admin/settings") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto pt-4">
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}