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
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        <Link 
          href={`/projects/${project.slug}/`}
          className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600"
          aria-label={`Read more about ${project.title} project`}
          title={`View details for ${project.title}`}
        >
          Read more about {project.title}
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}