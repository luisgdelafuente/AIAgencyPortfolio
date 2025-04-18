import { Metadata } from 'next';
import { getAllProjects, getPageContent } from '../lib/api';

// Generate dynamic metadata for the projects page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('projects');
  
  if (!pageContent) {
    return {
      title: 'Projects | HAL149',
      description: 'Explore our AI projects and solutions',
    };
  }
  
  try {
    const content = JSON.parse(pageContent.content);
    
    return {
      title: content.metaTitle || 'Projects | HAL149',
      description: content.metaDescription || 'Explore our AI projects and solutions',
      keywords: content.metaKeywords || 'ai projects, artificial intelligence solutions, HAL149 portfolio',
      openGraph: {
        title: content.ogTitle || content.metaTitle || 'Projects | HAL149',
        description: content.ogDescription || content.metaDescription || 'Explore our AI projects and solutions',
        images: content.ogImage ? [{ url: content.ogImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error parsing projects page content:', error);
    return {
      title: 'Projects | HAL149',
      description: 'Explore our AI projects and solutions',
    };
  }
}

// Projects page component
export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const pageContent = await getPageContent('projects');
  
  let content = {
    title: 'Projects',
    subtitle: 'Explore our work',
  };
  
  if (pageContent) {
    try {
      content = JSON.parse(pageContent.content);
    } catch (error) {
      console.error('Error parsing projects page content:', error);
    }
  }
  
  return (
    <main>
      <h1>{content.title}</h1>
      <p>{content.subtitle}</p>
      
      <div>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <a href={`/projects/${project.slug}`}>{project.title}</a>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </main>
  );
}