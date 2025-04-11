import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '@/components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@shared/schema';

export default function Projects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  return (
    <>
      <Helmet>
        <title>Projects | HAL149</title>
        <meta name="description" content="Explore our innovative AI projects across various industries." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <section className="bg-neutral-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Our Projects
              </h1>
              <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto">
                Explore how our AI solutions are transforming various industries
              </p>
            </div>
          </section>
          
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                  // Skeleton loaders while data is loading
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden border border-neutral-200">
                      <Skeleton className="w-full h-56" />
                      <div className="p-6">
                        <Skeleton className="h-4 w-1/4 mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
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
                    <p className="text-neutral-500">No projects available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
