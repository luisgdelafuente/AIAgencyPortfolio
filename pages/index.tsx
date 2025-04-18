import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import type { PageContent } from '@shared/schema';

// Import any components you need from your existing app
// For this example, I'm assuming components structure

interface HomeProps {
  pageContent: PageContent;
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

export default function Home({ pageContent, metadata }: HomeProps) {
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

      {/* Your existing home page components would go here */}
      <main>
        {/* You could use your existing HomeHero, FeaturedProjects, etc. components here */}
        <h1>HAL149 AI Agency</h1>
        {content && (
          <div>
            {/* Render your content based on the structure in your database */}
            {content.hero && (
              <section>
                <h2>{content.hero.title}</h2>
                <p>{content.hero.description}</p>
              </section>
            )}
            
            {/* More sections based on your content structure */}
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch the page content from your API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const pageContentRes = await fetch(`${apiUrl}/api/page-contents/home`);
    const pageContent = await pageContentRes.json();
    
    // Parse content to extract metadata
    let metadata = {
      title: 'HAL149 | Unlocking Your Business Potential with AI',
      description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
      keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
      canonical: 'https://hal149.com',
      ogTitle: 'HAL149 | Unlocking Your Business Potential with AI',
      ogDescription: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
      ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
    };
    
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
        metadata
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        pageContent: null,
        metadata: {
          title: 'HAL149 | Unlocking Your Business Potential with AI',
          description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
          keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
          canonical: 'https://hal149.com',
          ogTitle: 'HAL149 | Unlocking Your Business Potential with AI',
          ogDescription: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
          ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
        }
      }
    };
  }
};