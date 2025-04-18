"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  ClipboardList, 
  Settings,
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";

export default function AdminNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      name: "Content",
      href: "/admin/content",
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      name: "Waitlist",
      href: "/admin/waitlist",
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">HAL149 Admin</h1>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop & Mobile menu */}
      <nav
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block fixed md:static w-64 h-full bg-white border-r overflow-y-auto z-10`}
      >
        <div className="p-4 border-b hidden md:block">
          <h1 className="text-xl font-bold">HAL149 Admin</h1>
        </div>

        <div className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center p-2 rounded-md hover:bg-gray-100 
                      ${isActive(item.href, item.exact) ? "bg-gray-100 text-blue-600" : "text-gray-700"}`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t mt-auto">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>
    </>
  );
}