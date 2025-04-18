import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
}

/**
 * MetadataHelmet component - adds proper SEO metadata to pages
 * This is a client-side solution since we can't modify the server
 */
export default function MetadataHelmet({
  title = 'HAL149 | AI Agency',
  description = 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
  keywords = 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  canonical = 'https://hal149.com',
  ogTitle,
  ogDescription,
  ogImage = 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
  ogType = 'website'
}: MetadataProps) {
  // Use provided OpenGraph values or fall back to standard metadata
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;

  return (
    <Helmet>
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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}