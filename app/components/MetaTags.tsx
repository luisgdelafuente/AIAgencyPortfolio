'use client';

import React, { useEffect } from 'react';

interface MetadataProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

interface MetaTagsProps {
  metadata: MetadataProps;
  type?: 'website' | 'article';
  url: string;
}

// In Next.js App Router, we use the Metadata API instead of Head
// This component is kept for backward compatibility during migration
// It logs what would be rendered but doesn't actually modify metadata
export default function MetaTags({ metadata, type = 'website', url }: MetaTagsProps) {
  useEffect(() => {
    console.log('MetaTags rendering with:', { metadata, type, url });
  }, [metadata, type, url]);

  // In App Router, this component doesn't need to render anything
  // as metadata is handled by the Metadata API at page level
  return null;
}