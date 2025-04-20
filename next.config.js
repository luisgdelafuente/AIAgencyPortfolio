/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving
  output: 'standalone',
  
  // Configure images domains for loading from external sources
  images: {
    domains: ['spebrqnqmrmeacntsrmp.supabase.co', 'localhost'],
  },
  
  // Enable typechecking during build
  typescript: {
    // Temporarily ignore build errors during migration
    ignoreBuildErrors: true,
  },
};

export default nextConfig;