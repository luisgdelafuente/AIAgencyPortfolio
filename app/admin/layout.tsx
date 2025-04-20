"use client";

import * as React from "react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import AdminNav from "@/components/AdminNav";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const title = React.useMemo(() => {
    const path = pathname?.split("/").pop() || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  }, [pathname]);

  return (
    <div className="flex h-screen">
      <AdminNav />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}