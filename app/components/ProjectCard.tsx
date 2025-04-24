'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/shared/schema';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <div className="mb-3">
          <span className="text-sm text-gray-500">
            {project.category || 'Project'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          <Link 
            href={`/projects/${project.slug}`}
            aria-label={`Read more about ${project.title} project`}
            title={`Read more about ${project.title}`}
            className="hover:text-gray-600 transition-colors"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          {project.githubUrl && (
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View the code of ${project.title} project on GitHub`}
              title="View the code of this project"
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-normal py-1 px-2 hover:bg-gray-50 rounded-md"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          )}
          {project.demoUrl && (
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View an online demo of ${project.title} project`}
              title="View an online demo of the project"
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-normal py-1 px-2 hover:bg-gray-50 rounded-md"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}