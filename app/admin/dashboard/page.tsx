'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost, Project, WaitlistEntry, ContactMessage } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@shared/utils';
import { Mail, FileText, Briefcase, Users } from 'lucide-react';
import { AdminMetadata } from '@/components/AdminMetadata';

export default function AdminDashboard() {
  // Fetch data for the dashboard
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });
  
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  const { data: waitlistEntries } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
  });
  
  const { data: contactMessages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
  });
  
  // Calculate unread messages
  const unreadMessages = contactMessages?.filter(msg => !msg.read).length || 0;
  
  // Get the latest blog post and project
  const latestBlogPost = blogPosts && blogPosts.length > 0 ? blogPosts[0] : null;
  const latestProject = projects && projects.length > 0 ? projects[0] : null;
  
  return (
    <>
      <AdminMetadata 
        title="Dashboard | Admin" 
        noIndex={true}
      />
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats overview */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {latestBlogPost 
                  ? `Last updated: ${formatDate(latestBlogPost.publishedAt)}`
                  : 'No posts yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {latestProject
                  ? `Latest: ${latestProject.title}`
                  : 'No projects yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitlistEntries?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total subscribers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactMessages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {unreadMessages > 0 ? `${unreadMessages} unread` : 'All read'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent blog posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>Latest published articles</CardDescription>
            </CardHeader>
            <CardContent>
              {blogPosts && blogPosts.length > 0 ? (
                <div className="space-y-4">
                  {blogPosts.slice(0, 5).map(post => (
                    <div key={post.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                        {post.imageUrl && (
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{post.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No blog posts yet</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recent messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {contactMessages && contactMessages.length > 0 ? (
                <div className="space-y-4">
                  {contactMessages.slice(0, 5).map(message => (
                    <div key={message.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${message.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{message.subject}</p>
                        <p className="text-xs mb-1">From: {message.name} ({message.email})</p>
                        <p className="text-xs text-gray-500">{formatDate(message.submittedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No messages yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}