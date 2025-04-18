'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AdminNav from '@/components/AdminNav';
import { Toaster } from '@/components/ui/toaster';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  // Only redirect for pages deeper than /admin
  useEffect(() => {
    if (!loading && !authenticated && window.location.pathname !== '/admin') {
      router.push('/admin');
    }
  }, [authenticated, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and not at /admin, don't render anything (will redirect)
  if (!authenticated && window.location.pathname !== '/admin') {
    return null;
  }

  // Render admin navigation only if authenticated or at the login page
  return (
    <div className="flex h-screen bg-background">
      {authenticated && (
        <div className="w-64 border-r">
          <AdminNav />
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}