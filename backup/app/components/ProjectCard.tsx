'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/shared/schema';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
      {project.imageUrl && (
        <div className="h-48 relative overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 rounded-full mb-3">
          {project.category || 'Project'}
        </span>
        <h3 className="text-xl font-bold mb-2">
          <Link 
            href={`/projects/${project.slug}/`}
            className="hover:text-gray-600 transition-colors"
            aria-label={`Read more about ${project.title} project`}
            title={`View details for ${project.title}`}
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      </div>
    </div>
  );
}