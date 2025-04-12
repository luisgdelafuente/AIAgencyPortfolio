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
        
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Our Projects
              </h1>
              <p className="text-lg text-gray-600">
                Explore how our AI solutions are transforming various industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
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
                <div className="col-span-2 text-center py-16">
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
