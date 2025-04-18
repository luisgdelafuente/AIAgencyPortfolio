'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AdminNav from '@/components/AdminNav';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';

// This layout is applied to all admin/* routes
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminAuthCheck>
        <div className="min-h-screen bg-gray-50">
          <div className="flex">
            <AdminNav />
            <div className="flex-1 lg:ml-64">
              <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </div>
      </AdminAuthCheck>
    </AuthProvider>
  );
}

// Component to handle auth check and redirection
function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth, isLoading } = useAuth();
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

  // If loading, show a simple loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, children won't be rendered
  // The useEffect above will redirect to login page
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}