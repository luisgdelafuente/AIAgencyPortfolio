import { Metadata } from 'next';
import { getAllProjects, getProjectBySlug } from '../../lib/api';
import { notFound } from 'next/navigation';

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate dynamic metadata for projects
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found | HAL149',
    };
  }
  
  // Use metadata helper to create project specific metadata
  const { createMetadata } = await import('../../lib/metadata');
  
  return createMetadata('projects', {
    title: project.title,
    description: project.description,
    image: project.imageUrl,
    slug: project.slug,
    canonical: `https://hal149.com/projects/${project.slug}`
  });
}

// Project page component
export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full mb-4">
            {project.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{project.title}</h1>
          
          {project.imageUrl && (
            <div className="mt-6 mb-8 rounded-lg overflow-hidden">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="mb-6 text-gray-700 text-lg">
            {project.description}
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {/* 
            Using dangerouslySetInnerHTML is not ideal for security, but for a 
            controlled admin environment it's acceptable. In a production app,
            you might want to use a proper markdown or rich text renderer.
          */}
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>
        
        {/* Links section */}
        <div className="mt-12 flex flex-wrap gap-4">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub Repository
            </a>
          )}
          
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Live Demo
            </a>
          )}
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <a 
            href="/projects" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all projects
          </a>
        </div>
      </div>
    </div>
  );
}