import React from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import type { Project } from '@shared/schema';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-neutral-100">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-56 object-cover"
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full mb-4">
          {project.category}
        </span>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-neutral-600 mb-4">
          {project.description}
        </p>
        <Link 
          href={`/projects/${project.slug}`} 
          className="text-black inline-flex items-center hover:underline"
        >
          View Case Study <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
