# SEO Metadata Implementation: Complete Solution

## The Problem
We identified a critical SEO issue - metadata wasn't appearing in the HTML source of our pages. Search engine crawlers don't execute JavaScript, so they couldn't see our client-side rendered metadata.

## Root Cause Analysis
After extensive investigation, we found three critical issues:

1. **Client-Side Rendering**: Metadata was being injected with React Helmet after the page loaded
2. **No Server-Side Generation**: We weren't leveraging server-side rendering capabilities
3. **Missing Initial HTML**: The HTML source only contained a comment about metadata: `<!-- Title and description are dynamically managed by React Helmet -->`

## Complete Solution: Server-Side Rendering with Pages Router

We've implemented a solution that uses Next.js Pages Router with `getServerSideProps` to fetch metadata on the server and include it in the initial HTML response:

### 1. Proper Server-Side Page Structure (Pages Router)

```typescript
// pages/index.tsx (Home Page Example)
export default function Home({ pageContent, metadata }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.ogTitle || metadata.title} />
        <meta property="og:description" content={metadata.ogDescription || metadata.description} />
        <meta property="og:image" content={metadata.ogImage} />
        <meta property="og:url" content={metadata.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Additional metadata... */}
      </Head>
      
      {/* Page content... */}
    </>
  );
}
```

### 2. Server-Side Data Fetching with getServerSideProps

The critical part is using `getServerSideProps` to fetch metadata before rendering:

```typescript
export const getServerSideProps = async () => {
  try {
    // Fetch page content with metadata from the API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const pageContentRes = await fetch(`${apiUrl}/api/page-contents/home`);
    const pageContent = await pageContentRes.json();
    
    // Parse content to extract metadata
    let metadata = {
      title: 'Default Title',
      description: 'Default description',
      // Default values...
    };
    
    // Override with content from database
    if (pageContent?.content) {
      const parsedContent = JSON.parse(pageContent.content);
      if (parsedContent.metadata) {
        metadata = { ...metadata, ...parsedContent.metadata };
      }
    }

    return {
      props: {
        pageContent,
        metadata
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        pageContent: null,
        metadata: {
          // Fallback values...
        }
      }
    };
  }
};
```

### 3. Content-Type Specific Implementations

We've created separate implementations for different content types:

- **Home page**: `pages/index.tsx`
- **Blog posts**: `pages/blog/[slug].tsx`
- **Projects**: `pages/projects/[slug].tsx`

Each has custom metadata fetching specific to its content type.

### 4. Configuration for SSR Deployment

For proper SSR in production, we've configured Next.js to use the standalone server:

```js
// next.config.mjs
const nextConfig = {
  output: 'standalone',  // Use SSR instead of static export
  // other configuration...
};
```

### 5. Production Server Script

This script properly runs Next.js in production mode with SSR:

```bash
# start-next-server.sh
#!/bin/bash
echo "Building Next.js application with SSR..."
npx next build

echo "Starting Next.js server with SSR..."
npx next start
```

## Testing Procedure

To verify metadata implementation:

1. Start the Next.js server with SSR: `./run-servers.sh`
2. Wait for both servers to start
3. View page source (right-click > View Page Source) to verify metadata is in the HTML
4. Test different page types (home, blog posts, projects)

## Deployment Requirements

For this to work in production:

1. The `.replit` file should use Next.js's proper build and start commands:
   ```
   build = ["npx", "next", "build"]
   run = ["npx", "next", "start"]
   ```

2. Environment variables must be properly set:
   ```
   API_URL = http://localhost:5000  # Or production API URL
   ```

## Additional Notes

This implementation uses Next.js's Pages Router instead of App Router because:
1. It provides more direct control over server-side props
2. It works better with external API data sources 
3. It offers more predictable behavior for SEO metadata

When updating content in the admin panel, the changes will be immediately reflected in the metadata since we're fetching fresh data for every request.