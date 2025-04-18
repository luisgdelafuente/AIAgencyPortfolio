'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { formatDate } from '@/shared/utils';
import { 
  FileText, 
  BarChart3, 
  Users, 
  Mail,
  Layout,
  ArrowRight
} from 'lucide-react';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
};

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  submittedAt: string;
  read: boolean;
};

type WaitlistEntry = {
  id: number;
  email: string;
  submittedAt: string;
};

type PageContent = {
  id: number;
  page: string;
  updatedAt: string;
};

export default function AdminDashboard() {
  // Fetch data for the dashboard
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });
  
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  const { data: waitlistEntries, isLoading: isLoadingWaitlist } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
  });
  
  const { data: contactMessages, isLoading: isLoadingMessages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
  });
  
  const { data: pageContents, isLoading: isLoadingContents } = useQuery<PageContent[]>({
    queryKey: ['/api/page-contents'],
  });
  
  // Calculate unread messages
  const unreadMessages = contactMessages?.filter(msg => !msg.read).length || 0;
  
  // Get the latest blog post and project
  const latestBlogPost = blogPosts && blogPosts.length > 0 ? blogPosts[0] : null;
  const latestProject = projects && projects.length > 0 ? projects[0] : null;
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoadingBlogPosts ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{blogPosts?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
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
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoadingWaitlist ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{waitlistEntries?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <Mail className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoadingMessages ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {contactMessages?.length || 0}
                {unreadMessages > 0 && (
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
                    {unreadMessages} unread
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Contents</CardTitle>
            <Layout className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoadingContents ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{pageContents?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Recent Activity</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Latest Blog Post */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Latest Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingBlogPosts ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : latestBlogPost ? (
              <div>
                <h3 className="text-lg font-medium">{latestBlogPost.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Published on {formatDate(latestBlogPost.publishedAt)}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {latestBlogPost.excerpt}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No blog posts yet</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/blog">
                Manage Blog Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Latest Project */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Latest Project</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingProjects ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : latestProject ? (
              <div>
                <h3 className="text-lg font-medium">{latestProject.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Category: {latestProject.category}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {latestProject.description}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No projects yet</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/projects">
                Manage Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Quick Access */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Quick Access</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Update page contents and metadata to keep your site up-to-date.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/content">
                Manage Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              {unreadMessages > 0 
                ? `You have ${unreadMessages} unread messages to review.`
                : 'Stay on top of your contact form submissions.'}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/messages">
                View Messages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Waitlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              {waitlistEntries && waitlistEntries.length > 0
                ? `Currently ${waitlistEntries.length} subscribers on your waitlist.`
                : 'Manage your waitlist subscribers.'}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/waitlist">
                Manage Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}