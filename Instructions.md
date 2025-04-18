# SEO and Social Media Metadata Implementation Plan

## Current Issues Identified

After reviewing the codebase, I've identified the following issues with the metadata implementation:

1. **Multiple Implementation Approaches**: The application is using both Next.js built-in metadata API (server-side) and client-side DOM manipulation for metadata through custom components (`MetaTags` and `PageMetadata`).

2. **Hardcoded Metadata**: Most metadata in the app router pages (`app/blog/page.tsx`, `app/about/page.tsx`, etc.) is hardcoded rather than pulled from the database.

3. **Conflicting Metadata**: Client-side metadata manipulation conflicts with server-rendered metadata, causing inconsistencies in what search engines and social media platforms see.

4. **Incomplete Implementation**: The `generateMetadata` functions in dynamic routes (`[slug]` pages) are properly implemented, but static pages are not using dynamic metadata from the database.

## Solution Plan

### 1. Standardize on Next.js App Router Metadata API

Next.js App Router provides a powerful metadata API that works at build time and runtime. We'll standardize on this approach and remove client-side metadata manipulation.

### 2. Create a Utility Function for Database Metadata

We need a consistent way to fetch and format metadata from the database for use with Next.js metadata API.

### 3. Implement Dynamic Metadata for All Pages

Apply the dynamic metadata approach to all pages, ensuring all metadata comes from the database.

## Implementation Steps

### Step 1: Create Database Metadata Utility

Create a new utility file for fetching and formatting metadata from the database:

```typescript
// app/lib/metadataUtils.ts
import { Metadata } from 'next';
import { fetchPageContent } from './api';

// Default minimal metadata as fallback
const defaultMetadata: Metadata = {
  title: 'HAL149',
  description: '',
};

/**
 * Get metadata from database for a specific page
 */
export async function getPageMetadata(page: string): Promise<Metadata> {
  // Fetch page content from database
  const pageContent = await fetchPageContent(page);
  
  if (!pageContent || !pageContent.content) {
    return defaultMetadata;
  }
  
  // Parse the content
  let parsedContent;
  try {
    parsedContent = typeof pageContent.content === 'string' 
      ? JSON.parse(pageContent.content) 
      : pageContent.content;
  } catch (error) {
    console.error(`Error parsing ${page} content:`, error);
    return defaultMetadata;
  }
  
  // Extract metadata from content
  const metadata = parsedContent.metadata || {};
  
  // Format for Next.js Metadata API
  return {
    title: metadata.title || defaultMetadata.title,
    description: metadata.description || defaultMetadata.description,
    keywords: metadata.keywords || '',
    openGraph: {
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
      url: metadata.canonical || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
    },
    // Include canonical URL if available
    ...(metadata.canonical && { 
      alternates: { 
        canonical: metadata.canonical 
      } 
    }),
  };
}
```

### Step 2: Update Root Layout Metadata

Make the root layout metadata dynamic:

```typescript
// app/layout.tsx
import { Metadata } from 'next';
import { getPageMetadata } from './lib/metadataUtils';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('global');
}

// Rest of your layout component
```

### Step 3: Update Static Pages to Use Dynamic Metadata

Update all static pages to use dynamic metadata:

```typescript
// app/page.tsx (Home page)
import { Metadata } from 'next';
import { getPageMetadata } from './lib/metadataUtils';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('home');
}

// Rest of your page component
```

Apply the same approach to all other static pages (about, blog, projects, contact, legal).

### Step 4: Enhance Dynamic Route Pages

For dynamic routes like blog posts and projects, enhance the existing implementation:

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // First fetch the blog category page metadata for defaults
  const blogMetadata = await getPageMetadata('blog');
  
  // Then fetch specific post data
  const posts = await fetchBlogPosts();
  const post = posts.find(post => post.slug === params.slug);
  
  // If no post is found, return blog page metadata with error title
  if (!post) {
    return {
      ...blogMetadata,
      title: 'Blog Post Not Found | HAL149',
      description: 'The requested blog post could not be found.',
    };
  }
  
  // Return metadata based on the post, inheriting from blog metadata
  return {
    ...blogMetadata,
    title: `${post.title} | HAL149 Blog`,
    description: post.excerpt,
    keywords: `${post.title}, HAL149 blog, AI insights${blogMetadata.keywords ? `, ${blogMetadata.keywords}` : ''}`,
    openGraph: {
      ...blogMetadata.openGraph,
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : blogMetadata.openGraph?.images,
      type: 'article',
    },
  };
}
```

### Step 5: Remove Client-Side Metadata Manipulation

Since we're now handling all metadata through Next.js App Router, we should remove or disable client-side metadata manipulation to prevent conflicts:

1. Remove or disable `MetaTags` components from client-side pages
2. Update page content to ensure client-side doesn't try to modify metadata

### Step 6: Ensure Database Has Required Metadata

Make sure each page entry in the database contains the necessary metadata fields:

- title
- description
- keywords
- canonical
- ogTitle
- ogDescription
- ogImage

### Step 7: Test Implementation

Test the implementation to ensure metadata is correctly displayed:

1. Use browser dev tools to inspect `<head>` elements
2. Test with social media debugging tools:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
3. Test with SEO tools like [Google's Rich Results Test](https://search.google.com/test/rich-results)

## Considerations for Admin Panel

The admin panel already has metadata editing capabilities. We should ensure:

1. The metadata structure in the admin panel matches what our new implementation expects
2. The admin panel correctly saves metadata in the database
3. After updating metadata in the admin panel, the changes are reflected in the app

## Implementation Notes

- **No Hardcoded Values**: All metadata should come from the database; no values should be hardcoded.
- **Consistent Structure**: Maintain a consistent metadata structure across all pages.
- **Fallbacks**: Implement proper fallbacks when database content is missing or invalid.
- **Cache Revalidation**: Ensure metadata from the database is revalidated at appropriate intervals.

This comprehensive approach will standardize metadata implementation across your application, ensuring search engines and social media platforms receive the correct and most up-to-date information from your database.