import { fetchFeaturedProjects } from '../../lib/api';
import { marked } from 'marked';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';

type Props = {
  params: { slug: string }
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch all projects and find the one with matching slug
  const projects = await fetchFeaturedProjects();
  const project = projects.find(project => project.slug === params.slug);
  
  // If no project is found, return default metadata
  if (!project) {
    return {
      title: 'Project Not Found | HAL149',
      description: 'The requested project could not be found.',
    };
  }
  
  // Return metadata based on the project
  return {
    title: `${project.title} | HAL149 Projects`,
    description: project.description,
    keywords: `${project.title}, ${project.category}, HAL149 projects, AI solutions`,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.imageUrl ? [project.imageUrl] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  // Fetch all projects
  const projects = await fetchFeaturedProjects();
  
  // Find the project with matching slug
  const project = projects.find(project => project.slug === params.slug);
  
  // If project doesn't exist, show a not found message
  if (!project) {
    return (
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The project you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/projects" 
            className="inline-flex items-center justify-center h-12 px-6 font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </div>
    );
  }

  // Get related projects (same category, exclude current project)
  const relatedProjects = projects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 3);
    
  return (
    <div className="bg-white">
      {/* Hero Section with Featured Image */}
      <section className="relative bg-gray-900 text-white">
        {project.imageUrl && (
          <div className="absolute inset-0 opacity-40">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {project.description}
            </p>
            
            {/* Links */}
            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 px-6 font-medium bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                >
                  View on GitHub
                </a>
              )}
              
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 px-6 font-medium bg-gray-800 text-white border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-lg prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ 
                __html: marked.parse(project.content, { sanitize: false })
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Similar Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject) => (
                <article key={relatedProject.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
                  {relatedProject.imageUrl && (
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={relatedProject.imageUrl} 
                        alt={relatedProject.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 rounded-full mb-3">
                      {relatedProject.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      <Link href={`/projects/${relatedProject.slug}/`} className="hover:text-gray-600 transition-colors">
                        {relatedProject.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{relatedProject.description}</p>
                    <Link
                      href={`/projects/${relatedProject.slug}/`}
                      className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600"
                      aria-label={`Read more about ${relatedProject.title} project`}
                      title={`View details for ${relatedProject.title}`}
                    >
                      Read more about {relatedProject.title}
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link 
                href="/projects/" 
                className="inline-flex items-center justify-center h-12 px-6 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a similar solution?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Contact us to discuss how we can build a custom AI solution tailored to your specific business needs.
          </p>
          <Link 
            href="/contact/" 
            className="inline-flex items-center justify-center h-12 px-6 font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}