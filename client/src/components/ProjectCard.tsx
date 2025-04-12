import React from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
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
        <Link 
          href={`/projects/${project.slug}`} 
          className="inline-flex items-center text-gray-900 hover:text-gray-700 font-medium"
        >
          View Case Study →
        </Link>
      </div>
    </div>
  );
}
