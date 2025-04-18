import React from 'react';
import { AdminMetadata } from '@/components/AdminMetadata';
import AdminNav from '@/components/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, FileText, Users, Mail, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();

  const { data: blogPosts, isLoading: isLoadingPosts } = useQuery<any[]>({
    queryKey: ['/api/blog'],
    enabled: !!user
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery<any[]>({
    queryKey: ['/api/projects'],
    enabled: !!user
  });

  const { data: waitlistEntries, isLoading: isLoadingWaitlist } = useQuery<any[]>({
    queryKey: ['/api/waitlist'],
    enabled: !!user
  });
  
  const { data: contactMessages, isLoading: isLoadingMessages } = useQuery<any[]>({
    queryKey: ['/api/contact'],
    enabled: !!user
  });
  
  const { data: pageContents, isLoading: isLoadingContents } = useQuery<any[]>({
    queryKey: ['/api/page-contents'],
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <AdminMetadata 
        title="Admin Dashboard | HAL149"
        description="HAL149 admin dashboard to manage website content"
        noIndex={true}
      />
      
      <div className="min-h-screen bg-neutral-50">
        <AdminNav />
        
        <div className="lg:ml-64 h-full">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pt-2 lg:pt-0">Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingPosts ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{Array.isArray(blogPosts) ? blogPosts.length : 0}</div>
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
                    <div className="text-2xl font-bold">{Array.isArray(projects) ? projects.length : 0}</div>
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
                    <div className="text-2xl font-bold">{Array.isArray(waitlistEntries) ? waitlistEntries.length : 0}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                  <Mail className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingMessages ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{Array.isArray(contactMessages) ? contactMessages.length : 0}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Contents</CardTitle>
                  <LayoutDashboard className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingContents ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{Array.isArray(pageContents) ? pageContents.length : 0}</div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6 sm:mb-8">
              <CardHeader>
                <CardTitle>Welcome to the Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  From here, you can manage all your website content including blog posts, projects, page contents, contact messages, and waitlist subscribers.
                </p>
                <p className="mb-4">
                  The dashboard displays real-time statistics for all content sections in your website.
                </p>
                <p className="hidden sm:block">
                  Use the navigation panel to access and manage different sections of the admin dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
