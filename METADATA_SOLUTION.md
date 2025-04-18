# Next.js Metadata Implementation Solution

## The Problem
We encountered an issue with our Next.js application's metadata - it was not appearing in the HTML source. This is critical for SEO since search engine crawlers don't execute JavaScript and won't see client-side rendered metadata.

## Root Cause
1. **Client-Side Fetching**: We were fetching metadata client-side only, which happens after the HTML is delivered
2. **No Server-Side Generation**: We weren't using Next.js's built-in SSR/SSG capabilities for metadata
3. **Deployment Configuration**: The application was not properly configured for SSR in Replit

## Solution Implementation

### 1. Proper Next.js App Router Metadata API

We've implemented the official Next.js App Router metadata API using `generateMetadata` functions in each page:

```typescript
// Example from app/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  // Fetch page content for metadata
  const pageContentData = await fetchPageContent('home');
  const pageContent = parseContent(pageContentData?.content);
  const meta = pageContent.metadata || {};
  
  return {
    title: meta.title || 'HAL149',
    description: meta.description || 'Default description',
    // ...other metadata
  };
}
```

### 2. Server-Side Data Fetching

We've created dedicated API functions that fetch data with `cache: 'no-store'` to ensure fresh content:

```typescript
export async function fetchPageContent(pageName: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/page-contents/${pageName}`, {
      cache: 'no-store', // Forces a fetch request every time
    });
    // ...
  }
}
```

### 3. Type-Specific Metadata Utilities

We've implemented specialized metadata generators for different content types:

```typescript
export async function getBlogPostMetadata(slug: string): Promise<Metadata> {
  // Fetch the specific blog post
  const post = await fetchBlogPostBySlug(slug);
  
  // Generate metadata specific to this post
  return {
    title: `${post.title} | HAL149`,
    description: post.excerpt,
    // ...other metadata
  };
}
```

### 4. Server Setup Requirements

For this implementation to work properly in production:

1. Next.js must run with its built-in server (`next start`) not as a static export
2. The server must use the proper build command (`next build`)

We've created a dedicated script to run Next.js with SSR:
```bash
# start-next-server.sh
npx next build
npx next start
```

## Deployment Instructions

To ensure metadata works correctly:

1. Make sure to use `next build` and `next start` in production, not `next export`
2. For Replit deployment, the `.replit` file should use:
   ```
   build = ["npx", "next", "build"]
   run = ["npx", "next", "start"]
   ```

## Testing Your Implementation

When testing metadata implementation:

1. View page source (right-click > View Page Source) to see the HTML sent to the browser
2. Use tools like [metatags.io](https://metatags.io/) to validate your metadata
3. Test with the [Rich Results Test](https://search.google.com/test/rich-results) from Google

## Future Improvements

1. Implement static generation with ISR (Incremental Static Regeneration) for better performance
2. Add structured data (JSON-LD) for rich search results
3. Set up automatic metadata validation in CI/CD pipeline