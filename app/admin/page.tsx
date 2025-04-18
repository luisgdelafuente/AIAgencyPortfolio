"use client";

import * as React from "react";
import Link from "next/link";
import { 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart, 
  Clock,
  Calendar,
  Edit,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    blogs: 0,
    projects: 0,
    waitlist: 0,
    messages: 0,
  });

  // Fetch stats from the API
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch blog posts count
        const blogRes = await fetch("/api/blog");
        const blogs = await blogRes.json();

        // Fetch projects count
        const projectsRes = await fetch("/api/projects");
        const projects = await projectsRes.json();

        // Fetch waitlist entries count
        const waitlistRes = await fetch("/api/waitlist");
        const waitlist = await waitlistRes.json();

        // Fetch contact messages count
        const messagesRes = await fetch("/api/contact");
        const messages = await messagesRes.json();

        setStats({
          blogs: blogs.length,
          projects: projects.length,
          waitlist: waitlist.length,
          messages: messages.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {user && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-700">
            Welcome back, {user.username}!
          </h2>
          <p className="text-blue-600 mt-1">
            Here's an overview of your site's activity.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Blog Posts"
          value={stats.blogs}
          icon={<FileText className="h-8 w-8 text-blue-500" />}
          href="/admin/blog"
        />
        <StatCard
          title="Projects"
          value={stats.projects}
          icon={<BarChart className="h-8 w-8 text-green-500" />}
          href="/admin/projects"
        />
        <StatCard
          title="Waitlist"
          value={stats.waitlist}
          icon={<Users className="h-8 w-8 text-purple-500" />}
          href="/admin/waitlist"
        />
        <StatCard
          title="Messages"
          value={stats.messages}
          icon={<MessageSquare className="h-8 w-8 text-red-500" />}
          href="/admin/messages"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <QuickActionCard
          title="Content Management"
          description="Edit page content or create new blog posts"
          actions={[
            {
              label: "Edit Page Content",
              href: "/admin/content",
              icon: <Edit className="h-4 w-4 mr-2" />,
            },
            {
              label: "New Blog Post",
              href: "/admin/blog?new=true",
              icon: <Plus className="h-4 w-4 mr-2" />,
            },
          ]}
        />
        <QuickActionCard
          title="Project Management"
          description="Update existing projects or add new ones"
          actions={[
            {
              label: "View All Projects",
              href: "/admin/projects",
              icon: <BarChart className="h-4 w-4 mr-2" />,
            },
            {
              label: "Add New Project",
              href: "/admin/projects?new=true",
              icon: <Plus className="h-4 w-4 mr-2" />,
            },
          ]}
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <span className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Last 7 days
          </span>
        </div>
        <div className="text-gray-500 text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>Activity feed will be implemented soon.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, href }: { title: string; value: number; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div>{icon}</div>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({ 
  title, 
  description, 
  actions 
}: { 
  title: string; 
  description: string; 
  actions: { label: string; href: string; icon: React.ReactNode }[] 
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              {action.icon}
              {action.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}