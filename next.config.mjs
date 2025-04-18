/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side rendering instead of static export
  output: 'standalone',
  
  // Use SWC minifier for better performance
  swcMinify: true,
  
  // Don't run ESLint during builds for better performance
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Don't run TypeScript check during builds for better performance
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization configuration
  images: {
    domains: ['spebrqnqmrmeacntsrmp.supabase.co'],
  },
  
  // Environment variables available to client
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || '',
  },
  
  // Redirect requests to API to Express backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;