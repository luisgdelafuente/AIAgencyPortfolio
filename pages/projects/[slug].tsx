import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import type { Project } from '@shared/schema';

interface ProjectPageProps {
  project: Project;
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

export default function ProjectPage({ project, metadata }: ProjectPageProps) {
  const router = useRouter();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (project?.content) {
      setContent(project.content);
    }
  }, [project]);

  // Show a loading state when fallback is true and the project is not yet generated
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.ogTitle || metadata.title} />
        <meta name="twitter:description" content={metadata.ogDescription || metadata.description} />
        <meta name="twitter:image" content={metadata.ogImage} />
        
        {/* Canonical */}
        <link rel="canonical" href={metadata.canonical} />
      </Head>

      <main>
        {project ? (
          <article>
            <h1>{project.title}</h1>
            <div className="project-category">
              Category: {project.category}
            </div>
            {project.image_url && (
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="featured-image" 
              />
            )}
            <div 
              className="project-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        ) : (
          <div>Project not found</div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug;
    if (!slug) {
      return { notFound: true };
    }

    // Fetch project details from API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const projectRes = await fetch(`${apiUrl}/api/projects/${slug}`);
    
    if (!projectRes.ok) {
      return { notFound: true };
    }
    
    const project: Project = await projectRes.json();
    
    // Create metadata specifically for this project
    const metadata = {
      title: `${project.title} | HAL149 Projects`,
      description: project.description || '',
      keywords: `${project.category}, ai project, artificial intelligence, HAL149, ${project.title}`,
      canonical: `https://hal149.com/projects/${project.slug}`,
      ogTitle: `${project.title} | HAL149 Projects`,
      ogDescription: project.description || '',
      ogImage: project.image_url || 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
    };

    return {
      props: {
        project,
        metadata
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
};