'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

/**
 * This component uses the traditional Head approach rather than the new App Router metadata API
 * to ensure metadata is correctly applied in development mode.
 */
export default function NextHeadMetadata({ 
  title = 'HAL149',
  description = '',
  keywords = '',
  canonical = '',
  ogTitle = '',
  ogDescription = '',
  ogImage = ''
}: MetadataProps) {

  useEffect(() => {
    console.log('NextHeadMetadata rendering with:', { 
      title, description, keywords, canonical, ogTitle, ogDescription, ogImage 
    });
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage]);

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || title} />
      {ogDescription && <meta property="og:description" content={ogDescription || description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="HAL149" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      {ogDescription && <meta name="twitter:description" content={ogDescription || description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
}