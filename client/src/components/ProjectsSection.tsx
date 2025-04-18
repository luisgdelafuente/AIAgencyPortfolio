import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCard from './ProjectCard';
import type { Project } from '@shared/schema';
import { useTranslations } from '@/hooks/use-translations';

interface HomeContent {
  projectsTitle?: string;
  projectsSubtitle?: string;
  projectsCta?: string;
  [key: string]: any;
}

export default function ProjectsSection() {
  const t = useTranslations();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects/featured']
  });
  
  const [content, setContent] = useState<HomeContent>({
    projectsTitle: t.projects.title,
    projectsSubtitle: t.projects.subtitle,
    projectsCta: t.projects.cta
  });
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/page-contents/home');
        if (response.ok) {
          const data = await response.json();
          // Handle both string and object formats
          if (typeof data.content === 'string') {
            try {
              const parsedContent = JSON.parse(data.content);
              setContent(parsedContent);
            } catch (e) {
              console.error('Error parsing JSON content:', e);
            }
          } else if (typeof data.content === 'object') {
            setContent(data.content);
          }
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };
    
    fetchContent();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {content.projectsTitle || t.projects.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {content.projectsSubtitle || t.projects.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {isLoading ? (
            // Skeleton loaders while data is loading
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="w-full h-64" />
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
              <p className="text-gray-500">{t.projects.noProjects}</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="px-6 py-3 border-gray-300 hover:border-gray-400 text-gray-900 rounded-lg bg-white">
            <Link href="/projects/">{content.projectsCta || t.projects.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
