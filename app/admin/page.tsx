"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FilePenLine, 
  MessageSquare, 
  Folder, 
  Users,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    messages: 0,
    waitlist: 0,
    pages: 0
  });
  
  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch blog count
        const blogRes = await fetch('/api/blog');
        const blogs = await blogRes.json();
        
        // Fetch projects count
        const projectsRes = await fetch('/api/projects');
        const projects = await projectsRes.json();
        
        // Fetch messages count
        const messagesRes = await fetch('/api/contact');
        const messages = await messagesRes.json();
        
        // Fetch waitlist count
        const waitlistRes = await fetch('/api/waitlist');
        const waitlist = await waitlistRes.json();
        
        // Fetch page contents count
        const pagesRes = await fetch('/api/page-contents');
        const pages = await pagesRes.json();
        
        setStats({
          blogs: blogs.length,
          projects: projects.length,
          messages: messages.length,
          waitlist: waitlist.length,
          pages: pages.length
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    
    fetchStats();
  }, []);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the HAL149 admin panel</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/blog">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Blog Posts</CardTitle>
              <FilePenLine className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.blogs}</div>
              <p className="text-xs text-gray-500">Total blog posts</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/projects">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Projects</CardTitle>
              <Folder className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.projects}</div>
              <p className="text-xs text-gray-500">Total projects</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/messages">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Messages</CardTitle>
              <MessageSquare className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.messages}</div>
              <p className="text-xs text-gray-500">Contact messages</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/waitlist">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Waitlist</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.waitlist}</div>
              <p className="text-xs text-gray-500">Waitlist entries</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/content">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Page Content</CardTitle>
              <FileText className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pages}</div>
              <p className="text-xs text-gray-500">Managed page contents</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}