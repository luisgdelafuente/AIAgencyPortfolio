import { Metadata } from 'next';
import { getAllProjects, getPageContent } from '../lib/api';
import { Project } from '../../shared/schema';

// Generate dynamic metadata for the projects page
export async function generateMetadata(): Promise<Metadata> {
  // Get any custom metadata from the page content
  const pageContent = await getPageContent('projects');
  
  let metadata = {
    title: 'Projects | HAL149',
    description: 'Explore our AI-powered projects and solutions designed to transform businesses',
    keywords: 'ai projects, artificial intelligence solutions, hal149 case studies, ai applications',
  };
  
  if (pageContent) {
    try {
      const content = JSON.parse(pageContent.content);
      if (content.metadata) {
        metadata = {
          ...metadata,
          title: content.metadata.title || metadata.title,
          description: content.metadata.description || metadata.description,
          keywords: content.metadata.keywords || metadata.keywords,
        };
      }
    } catch (error) {
      console.error('Error parsing projects page content:', error);
    }
  }
  
  return {
    ...metadata,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      url: 'https://hal149.com/projects',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
  };
}

// Projects page component
export default async function ProjectsPage() {
  const [projects, pageContent] = await Promise.all([
    getAllProjects(),
    getPageContent('projects')
  ]);
  
  // Parse any custom content for the page
  let content = {
    title: 'Our Projects',
    subtitle: 'Explore our innovative AI solutions and case studies',
  };
  
  if (pageContent) {
    try {
      const parsed = JSON.parse(pageContent.content);
      content = {
        ...content,
        title: parsed.title || content.title,
        subtitle: parsed.subtitle || content.subtitle,
      };
    } catch (error) {
      console.error('Error parsing projects page content:', error);
    }
  }
  
  // Group projects by category for better organization
  const projectsByCategory: Record<string, Project[]> = {};
  
  if (projects && projects.length > 0) {
    projects.forEach((project) => {
      if (!projectsByCategory[project.category]) {
        projectsByCategory[project.category] = [];
      }
      projectsByCategory[project.category].push(project);
    });
  }
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        
        {projects && projects.length > 0 ? (
          // Render projects by category
          Object.keys(projectsByCategory).map((category) => (
            <div key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectsByCategory[category].map((project) => (
                  <div key={project.id} className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 h-full">
                    {project.imageUrl && (
                      <div className="h-56 relative overflow-hidden">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <a 
                        href={`/projects/${project.slug}`} 
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 mt-auto"
                      >
                        View project
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No projects available at the moment. Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}