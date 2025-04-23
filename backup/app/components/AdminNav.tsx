"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Mail, 
  LogOut,
  FileCode,
  Menu,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
    },
    {
      title: "Blog Posts",
      href: "/admin/blog",
      icon: <FileText className="w-4 h-4 mr-2" />,
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: <FileCode className="w-4 h-4 mr-2" />,
    },
    {
      title: "Page Content",
      href: "/admin/content",
      icon: <FileText className="w-4 h-4 mr-2" />,
    },
    {
      title: "Waitlist",
      href: "/admin/waitlist",
      icon: <Users className="w-4 h-4 mr-2" />,
    },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: <Mail className="w-4 h-4 mr-2" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMobileMenu();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="block lg:hidden absolute right-4 top-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-1"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-screen w-64 bg-gray-50 border-r border-gray-200 p-5">
        <div className="flex items-center mb-8">
          <span className="text-xl font-bold">HAL149 Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md text-sm ${
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white">
          <div className="flex flex-col h-full p-5">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold">HAL149 Admin</span>
            </div>
            <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 rounded-md text-base ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 py-3"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}