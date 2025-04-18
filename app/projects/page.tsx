import { fetchPageContent, fetchFeaturedProjects } from '../lib/api';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Projects & Case Studies | HAL149',
  description: 'Explore our portfolio of successful AI implementations and innovative solutions across various industries.',
  keywords: 'AI projects, machine learning portfolio, HAL149 case studies, artificial intelligence implementations',
};

// Parse content from string to JSON
const parseContent = (content: string | undefined) => {
  if (!content) return {};
  try {
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return {};
  }
};

export default async function Projects() {
  // Fetch data using server components
  const pageContentData = await fetchPageContent('projects');
  const projects = await fetchFeaturedProjects();
  
  // Parse the page content
  const pageContent = parseContent(pageContentData?.content);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              {pageContent.projectsTitle || 'Our AI Projects'}
            </h1>
            <p className="text-xl text-gray-300">
              {pageContent.projectsSubtitle || 'Innovative AI solutions delivering real business value'}
            </p>
          </div>
        </div>
      </section>

      {/* Project Filters - Future Enhancement */}
      {/* <section className="py-8 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Filter by category</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-900 text-white rounded-md">All</button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md">AI Applications</button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md">Machine Learning</button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md">Data Analysis</button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <article key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
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
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      <Link href={`/projects/${project.slug}`} className="hover:text-gray-600 transition-colors">
                        {project.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600"
                    >
                      View Project
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl font-medium text-gray-900 mb-2">No projects found</h2>
              <p className="text-gray-600">
                Check back soon for our portfolio of AI projects!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {pageContent.ctaTitle || 'Ready to Transform Your Business with AI?'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {pageContent.ctaText || 'Get in touch to discuss how our AI solutions can help your organization achieve its goals.'}
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center h-12 px-6 font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            {pageContent.ctaButton || 'Contact Us'}
          </Link>
        </div>
      </section>
    </div>
  );
}