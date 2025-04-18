/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports if needed
  // output: 'export',
  
  // Configure rewrites to proxy API requests to our Express server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy API requests to Express
      },
    ];
  },

  // Other Next.js config options
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;