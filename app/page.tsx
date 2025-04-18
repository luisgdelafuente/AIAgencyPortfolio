import { Metadata } from 'next';
import { fetchPageContent, fetchBlogPosts, fetchFeaturedProjects } from '@/lib/api';
import { parseMetadata } from './lib/staticMetadata';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProjectsSection from '@/components/ProjectsSection';
import BlogSection from '@/components/BlogSection';
import Waitlist from '@/components/Waitlist';
import NextHeadMetadata from '@/components/NextHeadMetadata';

/**
 * Export static metadata for SEO
 * Note: This may not work perfectly in development mode but will work correctly in production
 */
export const metadata: Metadata = {
  title: 'HAL149 | Unlocking Your Business Potential with AI',
  description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  alternates: {
    canonical: 'https://hal149.com',
  },
  openGraph: {
    title: 'HAL149 | Unlocking Your Business Potential with AI',
    description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
    url: 'https://hal149.com',
    siteName: 'HAL149',
    images: [
      {
        url: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
        width: 480,
        height: 480,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

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

export default async function Home() {
  // Fetch data using server components
  const pageContentData = await fetchPageContent('home');
  const featuredProjects = await fetchFeaturedProjects();
  const blogPosts = await fetchBlogPosts();
  
  // Parse the page content
  const pageContent = parseContent(pageContentData?.content);

  // Log metadata for debugging
  console.log('Home page metadata:', 
    pageContent.metadata || {}
  );

  // Extract metadata from the page content for client-side component
  const meta = pageContent.metadata || {};

  return (
    <div className="bg-white">
      {/* Client-side metadata component */}
      <ClientMetadata metadata={meta} />

      {/* Hero section */}
      <Hero content={pageContent} isLoading={!pageContentData} />
      
      {/* Features section */}
      <Features content={pageContent} isLoading={!pageContentData} />
      
      {/* Projects section */}
      <ProjectsSection projects={featuredProjects || []} isLoading={!featuredProjects} />
      
      {/* Blog section */}
      <BlogSection posts={blogPosts || []} isLoading={!blogPosts} />
      
      {/* Waitlist section */}
      <Waitlist />
      
      {/* Informational section about the migration */}
      <section className="py-8 bg-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Next.js Migration in Progress</h2>
            <p className="mb-4">
              We're migrating the HAL149 website to Next.js for improved performance and features.
              Some sections may be under construction while we complete the migration.
            </p>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Migration Status</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>✓ Next.js setup complete</li>
                <li>✓ App Router structure implemented</li>
                <li>✓ Basic layout and navigation integrated</li>
                <li>✓ Translation system migrated</li>
                <li>✓ Core components migrated</li>
                <li>✓ Data fetching integration</li>
                <li>→ Content page migrations in progress</li>
                <li>→ Admin pages migration in progress</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Client component wrapper to use NextHeadMetadata
'use client';
import { useEffect } from 'react';

function ClientMetadata({ metadata }: { metadata: any }) {
  useEffect(() => {
    // Implement direct DOM manipulation for metadata
    if (metadata) {
      // Set title
      if (metadata.title) {
        document.title = metadata.title;
      }
      
      // Set meta description
      if (metadata.description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', metadata.description);
        } else {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          metaDesc.setAttribute('content', metadata.description);
          document.head.appendChild(metaDesc);
        }
      }
      
      // Set other meta tags
      const metaTags = [
        { name: 'keywords', content: metadata.keywords },
        { property: 'og:title', content: metadata.ogTitle || metadata.title },
        { property: 'og:description', content: metadata.ogDescription || metadata.description },
        { property: 'og:image', content: metadata.ogImage },
        { property: 'og:url', content: metadata.canonical },
        { name: 'twitter:title', content: metadata.ogTitle || metadata.title },
        { name: 'twitter:description', content: metadata.ogDescription || metadata.description },
        { name: 'twitter:image', content: metadata.ogImage }
      ];
      
      metaTags.forEach(tag => {
        if (!tag.content) return; // Skip if no content
        
        const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
        let metaTag = document.querySelector(selector);
        
        if (metaTag) {
          metaTag.setAttribute('content', tag.content);
        } else {
          metaTag = document.createElement('meta');
          if (tag.name) metaTag.setAttribute('name', tag.name);
          if (tag.property) metaTag.setAttribute('property', tag.property);
          metaTag.setAttribute('content', tag.content);
          document.head.appendChild(metaTag);
        }
      });
      
      // Set canonical
      if (metadata.canonical) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', metadata.canonical);
        } else {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute('href', metadata.canonical);
          document.head.appendChild(canonical);
        }
      }
    }
  }, [metadata]);
  
  return null; // This component doesn't render anything visible
}