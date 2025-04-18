#!/bin/bash

# This script builds and runs Next.js in production mode with server-side rendering
# Use this for proper SEO metadata that appears in the HTML source

echo "Building Next.js application with SSR..."
npx next build

echo "Starting Next.js server with SSR..."
npx next start