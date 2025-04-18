'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AdminNav from '@/components/AdminNav';
import { Toaster } from '@/components/ui/toaster';

// This layout is applied to all admin/* routes except the login page
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status when the component mounts
    const verifyAuth = async () => {
      // Only redirect if we've checked auth status and user is not authenticated
      const isAuthed = await checkAuth();
      if (!isAuthed) {
        router.push('/admin');
      }
    };
    
    verifyAuth();
  }, [checkAuth, router]);

  // If not authenticated, show a simple loading state
  // The useEffect above will redirect to login page
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Admin sidebar navigation */}
      <AdminNav />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}