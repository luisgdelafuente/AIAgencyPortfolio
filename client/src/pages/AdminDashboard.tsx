import React, { useContext, useEffect } from 'react';
import { Helmet } from "react-helmet";
import AdminNav from '@/components/AdminNav';
import { useLocation } from 'wouter';
import { AuthContext, AuthContextType } from '@/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, FileText, Users } from 'lucide-react';

export default function AdminDashboard() {
  const auth = useContext(AuthContext) as AuthContextType;
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!auth.user && !auth.isLoading) {
      setLocation('/admin');
    }
  }, [auth.user, auth.isLoading, setLocation]);

  const { data: blogPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['/api/blog'],
    enabled: !!auth.user
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects'],
    enabled: !!auth.user
  });

  const { data: waitlistEntries, isLoading: isLoadingWaitlist } = useQuery({
    queryKey: ['/api/waitlist'],
    enabled: !!auth.user
  });

  if (auth.isLoading) {
    return <p>Loading...</p>;
  }

  if (!auth.user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | HAL149</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex h-screen bg-neutral-50">
        <AdminNav />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingPosts ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{blogPosts?.length || 0}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <BarChart3 className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingProjects ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{projects?.length || 0}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waitlist Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingWaitlist ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{waitlistEntries?.length || 0}</div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Welcome to the Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  From here, you can manage your website content including blog posts, projects, and view waitlist subscribers.
                </p>
                <p>
                  Use the navigation panel on the left to access different sections of the admin dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
