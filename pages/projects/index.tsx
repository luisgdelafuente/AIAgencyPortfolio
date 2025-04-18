import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Project, PageContent } from '@shared/schema';

interface ProjectsIndexProps {
  pageContent: PageContent;
  projects: Project[];
  metadata: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
}

export default function ProjectsIndex({ pageContent, projects, metadata }: ProjectsIndexProps) {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // Parse page content
    if (pageContent?.content) {
      try {
        const parsedContent = typeof pageContent.content === 'string' 
          ? JSON.parse(pageContent.content) 
          : pageContent.content;
        setContent(parsedContent);
      } catch (e) {
        console.error('Error parsing page content:', e);
      }
    }
  }, [pageContent]);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.ogTitle || metadata.title} />
        <meta property="og:description" content={metadata.ogDescription || metadata.description} />
        <meta property="og:image" content={metadata.ogImage} />
        <meta property="og:url" content={metadata.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.ogTitle || metadata.title} />
        <meta name="twitter:description" content={metadata.ogDescription || metadata.description} />
        <meta name="twitter:image" content={metadata.ogImage} />
        
        {/* Canonical */}
        <link rel="canonical" href={metadata.canonical} />
      </Head>

      <main>
        {/* Header */}
        <header>
          <h1>Our AI Projects</h1>
          {content?.header?.description && (
            <p>{content.header.description}</p>
          )}
        </header>

        {/* Projects list */}
        <section className="projects">
          {projects && projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project) => (
                <article key={project.id} className="project-card">
                  <Link href={`/projects/${project.slug}`}>
                    {project.image_url && (
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="project-thumbnail" 
                      />
                    )}
                    <h2>{project.title}</h2>
                  </Link>
                  <div className="project-category">{project.category}</div>
                  <p className="project-description">{project.description}</p>
                  <Link href={`/projects/${project.slug}`} className="view-project">
                    View Project
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p>No projects available at the moment.</p>
          )}
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch the page content and projects from your API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    const [pageContentRes, projectsRes] = await Promise.all([
      fetch(`${apiUrl}/api/page-contents/projects`),
      fetch(`${apiUrl}/api/projects`)
    ]);
    
    const pageContent = await pageContentRes.json();
    const projects = await projectsRes.json();
    
    // Default metadata for projects index
    let metadata = {
      title: 'AI Projects & Case Studies | HAL149',
      description: 'Explore our cutting-edge AI projects and solutions - from machine learning implementations to advanced chatbots and data analysis tools.',
      keywords: 'AI projects, artificial intelligence case studies, machine learning solutions, HAL149 portfolio',
      canonical: 'https://hal149.com/projects/',
      ogTitle: 'Innovative AI Projects & Solutions | HAL149',
      ogDescription: 'See how we\'ve helped businesses transform with artificial intelligence. Browse our portfolio of AI and machine learning projects.',
      ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
    };
    
    // Override with page content metadata if available
    if (pageContent?.content) {
      try {
        const parsedContent = typeof pageContent.content === 'string' 
          ? JSON.parse(pageContent.content) 
          : pageContent.content;
          
        if (parsedContent.metadata) {
          metadata = { ...metadata, ...parsedContent.metadata };
        }
      } catch (e) {
        console.error('Error parsing content:', e);
      }
    }

    return {
      props: {
        pageContent,
        projects,
        metadata
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        pageContent: null,
        projects: [],
        metadata: {
          title: 'AI Projects & Case Studies | HAL149',
          description: 'Explore our cutting-edge AI projects and solutions - from machine learning implementations to advanced chatbots and data analysis tools.',
          keywords: 'AI projects, artificial intelligence case studies, machine learning solutions, HAL149 portfolio',
          canonical: 'https://hal149.com/projects/',
          ogTitle: 'Innovative AI Projects & Solutions | HAL149',
          ogDescription: 'See how we\'ve helped businesses transform with artificial intelligence. Browse our portfolio of AI and machine learning projects.',
          ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
        }
      }
    };
  }
};