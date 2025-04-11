import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCard from './ProjectCard';
import type { Project } from '@shared/schema';

export default function ProjectsSection() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects/featured']
  });

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            See how our AI solutions are transforming industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            // Skeleton loaders while data is loading
            Array(2).fill(0).map((_, i) => (
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

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-neutral-300 text-black hover:bg-neutral-100">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
