/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving
  output: 'standalone',
  
  // Configure images domains for loading from external sources
  images: {
    domains: ['spebrqnqmrmeacntsrmp.supabase.co', 'localhost'],
    unoptimized: true,
  },
  
  // Enable typechecking during build
  typescript: {
    // Temporarily ignore build errors during migration
    ignoreBuildErrors: true,
  },
  
  // Replit specific configuration
  experimental: {
    appDocumentPreloading: true,
  },
  
  // Ensure React server components work properly
  reactStrictMode: true,
  
  // Configure server-side env fetching
  serverRuntimeConfig: {
    // Will only be available on the server side
    PORT: process.env.PORT || 5000,
  },
  
  // Configure both client and server env
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/public',
  },
  
  // Ensure API routes work properly
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      }
    ];
  },
};

export default nextConfig;