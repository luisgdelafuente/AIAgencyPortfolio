import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoute, Link } from 'wouter';
import type { Project } from '@shared/schema';
import { ChevronLeft } from 'lucide-react';

export default function ProjectDetailPage() {
  const [, params] = useRoute('/projects/:slug');
  const slug = params?.slug || '';

  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: [`/api/projects/${slug}`]
  });

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <p className="mb-6">The project you are looking for does not exist.</p>
            <Link href="/projects" className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to projects
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project ? `${project.title} | HAL149` : 'Project | HAL149'}</title>
        <meta name="description" content={project?.description || 'HAL149 project'} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {isLoading ? (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-6" />
              <Skeleton className="h-64 w-full mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : project ? (
            <>
              <div className="bg-neutral-50 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Link href="/projects" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to projects
                  </Link>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-200 text-neutral-800 rounded-full mb-4">
                    {project.category}
                  </span>
                  <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                  <p className="text-xl text-neutral-600">{project.description}</p>
                </div>
              </div>
              
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-auto rounded-lg mb-8"
                />
                <div className="prose max-w-none">
                  {/* In a real app, you would use a markdown renderer here */}
                  <div dangerouslySetInnerHTML={{ __html: project.content }} />
                </div>
              </div>
            </>
          ) : null}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
