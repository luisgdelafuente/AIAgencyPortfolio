import Head from 'next/head';
import { useEffect, useState } from 'react';

interface NextHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * NextHead component for proper SEO metadata in Next.js
 * This component works specifically with Next.js to ensure server-rendered metadata
 */
export default function NextHead({
  title = 'HAL149 | AI Agency',
  description = 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
  keywords = 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  canonical = 'https://hal149.com',
  ogTitle,
  ogDescription,
  ogImage = 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
  ogType = 'website',
  twitterCard = 'summary_large_image'
}: NextHeadProps) {
  // Use provided OpenGraph values or fall back to standard metadata
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  
  // Remove any Replit-specific placeholders
  useEffect(() => {
    // Remove Replit specific title injected by Replit
    const titleElements = document.querySelectorAll('title');
    if (titleElements.length > 1) {
      // Keep only our title element
      Array.from(titleElements).forEach((el, index) => {
        if (index > 0 && el.textContent?.includes('Replit')) {
          el.remove();
        }
      });
    }
    
    // Remove any Replit-specific meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(tag => {
      const content = tag.getAttribute('content');
      if (content && (
        content.includes('replit.com') || 
        tag.getAttribute('name')?.includes('replit') ||
        tag.getAttribute('property')?.includes('replit')
      )) {
        tag.remove();
      }
    });
  }, []);

  return (
    <Head>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="HAL149" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
      
      {/* Ensure Replit doesn't override our metadata */}
      <meta name="next-head-count" content="15" />
    </Head>
  );
}