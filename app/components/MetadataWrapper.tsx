'use client';

/**
 * This component is no longer actively used as metadata is now handled directly by
 * Next.js App Router metadata API in each page's generateMetadata function.
 * 
 * We keep this component for now to avoid breaking existing code, but its
 * functionality has been replaced by the proper server-side generateMetadata functions
 * in each page.
 * 
 * SEO-critical metadata is now guaranteed to be in the HTML source of each page.
 */
export default function MetadataWrapper() {
  // No client-side metadata manipulation needed
  // The Next.js App Router metadata API handles all metadata
  return null;
}