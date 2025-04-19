'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { Project, PageContent } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { marked } from 'marked';
import MetaTags from '@/components/MetaTags';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Fetch the specific project
  const { data: project, isLoading: isLoadingProject } = useQuery<Project>({
    queryKey: [`/api/projects/${slug}`],
  });
  
  // Fetch page metadata (for default project metadata)
  const { data: pageContent, isLoading: isLoadingContent } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/projects'],
  });
  
  // Loading state
  const isLoading = isLoadingProject || isLoadingContent;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-2/4 mb-6" />
              
              <Skeleton className="h-64 w-full mb-8 rounded-lg" />
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
              
              <div className="space-y-4 prose prose-lg max-w-none">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Handle not found
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">The project you're looking for doesn't exist or may have been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Extract metadata (inherit from page content)
  const metadata = {
    title: project.title ? `${project.title} | HAL149` : undefined,
    description: project.description,
    keywords: `${project.title}, ${project.category}, ai project`,
    canonical: `https://hal149.com/projects/${project.slug}/`,
    ogTitle: project.title,
    ogDescription: project.description,
    ogImage: project.imageUrl
  };
  
  return (
    <>
      <MetaTags 
        metadata={metadata} 
        url={`https://hal149.com/projects/${project.slug}/`}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article>
              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {project.description}
                </p>
                <div className="bg-gray-100 text-gray-900 inline-block px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </div>
              </header>
              
              {project.imageUrl && (
                <div className="mb-8">
                  <img 
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mb-8">
                {project.githubUrl && (
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github size={18} />
                      <span>View Code</span>
                    </a>
                  </Button>
                )}
                
                {project.demoUrl && (
                  <Button asChild className="flex items-center gap-2">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={18} />
                      <span>Live Demo</span>
                    </a>
                  </Button>
                )}
              </div>
              
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: marked.parse(project.content) 
                }}
              />
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}