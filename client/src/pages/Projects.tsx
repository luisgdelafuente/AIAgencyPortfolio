import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '@/components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project, PageContent } from '@shared/schema';
import { extractMetadata } from '@/lib/metadata';

export default function Projects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });
  
  // Fetch projects page metadata
  const { data: pageContent } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/projects'],
  });
  
  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);

  return (
    <>
      <MetaTags 
        metadata={metadata}
        url="https://hal149.com/projects/"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Our Projects
              </h1>
              <p className="text-lg text-gray-600">
                Explore how our AI solutions are transforming various industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {isLoading ? (
                // Skeleton loaders while data is loading
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="w-full h-64" />
                    <div className="p-6">
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))
              ) : projects && projects.length > 0 ? (
                // Display projects
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500">No projects available yet.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
