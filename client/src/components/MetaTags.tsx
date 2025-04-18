import React from 'react';
import { Metadata } from '@/lib/metadata';

interface MetaTagsProps {
  metadata: Metadata;
  type?: 'website' | 'article';
  url?: string;
  pageTitle?: string; // Optional explicit page title that overrides metadata.title
}

/**
 * DISABLED: MetaTags component
 * 
 * This component has been intentionally disabled to allow the Next.js App Router's
 * built-in metadata API to work properly. The server-side metadata is now handled 
 * by the generateMetadata functions in each page.
 * 
 * DO NOT MODIFY THIS FILE - Client-side metadata manipulation has been
 * disabled to avoid conflicts with Next.js metadata system.
 */
export default function MetaTags({ 
  metadata, 
  type = 'website',
  url,
  pageTitle
}: MetaTagsProps) {
  // Log that the component is disabled
  console.log('MetaTags is disabled to allow Next.js metadata API to work. Data received:', 
    { metadata, type, url, pageTitle }
  );
  
  // This component doesn't render anything or manipulate the DOM
  return null;
}