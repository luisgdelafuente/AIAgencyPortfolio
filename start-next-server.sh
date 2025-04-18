#!/bin/bash

# This script starts the Next.js server with the proper configuration for SSR

# Set environment variable for development mode
export NODE_ENV=development
export API_URL=http://localhost:5000

# Build the Next.js app for proper SSR
echo "Building Next.js app for Server-Side Rendering..."
npx next build

# Start the Next.js server
echo "Starting Next.js server with SSR..."
npx next start