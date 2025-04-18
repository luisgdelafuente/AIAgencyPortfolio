/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static file serving from the public directory
  images: {
    domains: ['spebrqnqmrmeacntsrmp.supabase.co'], // Allow Supabase storage domain for images
  },
  
  // Environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  
  // Prevent specific Replit metadata from showing in production
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Remove Replit-related headers
          {
            key: 'X-Replit-User-Id',
            value: '',
          },
          {
            key: 'X-Replit-User-Name',
            value: '',
          },
          {
            key: 'X-Replit-User-Roles',
            value: '',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;