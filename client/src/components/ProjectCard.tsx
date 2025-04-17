import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@shared/schema';

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
        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mb-4">
          {project.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex items-center gap-4 mt-auto">
          {project.githubUrl && (
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View the code of ${project.title} project on GitHub`}
              title="View the code of this project"
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-normal"
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
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-normal"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Live Demo</span>
            </a>
          )}
          <Link 
            href={`/projects/${project.slug}`} 
            aria-label={`Read the details of ${project.title} project`}
            title="Read the project details"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-normal"
          >
            <span>Read more</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
