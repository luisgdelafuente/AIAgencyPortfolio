# HAL149 Metadata Implementation Guide

## Overview

This document describes the implementation of SEO and social media metadata in the HAL149 website. The solution uses a custom server approach that ensures metadata is:

1. Dynamically loaded from the database
2. Properly included in the initial HTML source (essential for SEO)
3. Unique for each page, including blog posts and project pages
4. Manageable through the existing admin panel

## Architecture

The solution consists of two main parts:

1. **Custom Express Server** - A server that processes requests before sending them to Next.js, intercepting the HTML and injecting metadata.
2. **Simplified Client** - The client-side components no longer need to manage metadata, as it's already in the HTML.

## Files

- `server-next.cjs` - Custom Next.js server with metadata injection
- `run-servers.sh` - Script to run both the Express API and the custom Next.js server
- `app/components/MetadataWrapper.tsx` - Empty component (metadata is now handled server-side)

## How It Works

1. When a request comes in, the custom server determines the page type (home, about, blog post, etc.)
2. It fetches the appropriate metadata from the API
3. It renders the page with Next.js
4. Before sending the HTML to the browser, it injects the metadata
5. The result is HTML with proper metadata tags in the source code

## Running the Solution

To run the solution, use the following command:

```
./run-servers.sh
```

This script:
1. Starts the Express API server
2. Waits for it to initialize
3. Starts the custom Next.js server
4. Keeps both running until terminated

## Supported Metadata

The solution supports all standard SEO and social media metadata:

- Basic (title, description, keywords)
- Open Graph (og:title, og:description, og:image, og:url, og:type)
- Twitter Card (twitter:card, twitter:title, twitter:description, twitter:image)
- Canonical URL

## Admin Panel Integration

The existing admin panel can be used to edit metadata for each page. The metadata is stored in the database and dynamically loaded by the custom server for each page.

## Testing

To test that metadata is being correctly rendered, view the page source in your browser (right-click > View Page Source) and look for the metadata tags in the `<head>` section.

## Security

All metadata values are sanitized to prevent XSS attacks.

## Troubleshooting

If metadata is not appearing:

1. Check that both servers are running (Express API and custom Next.js server)
2. Verify that the metadata exists in the database for the page
3. Check the server logs for any errors in fetching or processing metadata