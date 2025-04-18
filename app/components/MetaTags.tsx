import React from 'react';
import Head from 'next/head';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

export default function MetaTags({
  title = 'HAL149 | AI Agency',
  description = 'Next-generation AI solutions for modern businesses. We develop cutting-edge AI applications to transform your digital presence.',
  keywords = 'AI, artificial intelligence, machine learning, deep learning, AI agency, digital transformation',
  ogImage = '/hallogoblack480.webp',
  ogUrl = 'https://hal149.ai',
  ogType = 'website'
}: MetaTagsProps) {
  const fullTitle = title.includes('HAL149') ? title : `${title} | HAL149`;
  
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </>
  );
}