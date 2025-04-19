/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving
  output: 'standalone',
  
  // Rewrites API requests to our Express backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  
  // Configure images domains for loading from external sources
  images: {
    domains: ['spebrqnqmrmeacntsrmp.supabase.co', 'localhost'],
  },
  
  // Enable typechecking during build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;