/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving for standalone deployment
  output: 'standalone',
  
  // Configure images domains for loading from external sources
  images: {
    domains: ['spebrqnqmrmeacntsrmp.supabase.co', 'localhost'],
  },
  
  // Enable typechecking during build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configure server settings
  serverExternalPackages: ['drizzle-orm'],
};

export default nextConfig;