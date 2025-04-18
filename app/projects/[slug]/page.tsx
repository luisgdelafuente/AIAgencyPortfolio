import { Metadata } from 'next';
import { getProjectBySlug } from '../../lib/api';
import { notFound } from 'next/navigation';

// Generate static params for all projects (for static generation)
export async function generateStaticParams() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`);
  const projects = await response.json();
  
  return projects.map((project: any) => ({
    slug: project.slug,
  }));
}

// Generate dynamic metadata for each project
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found | HAL149',
    };
  }
  
  return {
    title: `${project.title} | HAL149 Projects`,
    description: project.description,
    openGraph: {
      title: `${project.title} | HAL149 Projects`,
      description: project.description,
      images: project.image_url ? [{ url: project.image_url }] : [],
    },
  };
}

// Project page component
export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }
  
  return (
    <main>
      <article>
        {project.image_url && (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-64 object-cover mb-8"
          />
        )}
        
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl mb-8">{project.description}</p>
        
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />
      </article>
    </main>
  );
}