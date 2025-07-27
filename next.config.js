/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Web Service
  // output: 'export', // Commented out for Web Service
  trailingSlash: true,
  images: {
    unoptimized: false // Enable image optimization for Web Service
  },
  // Security headers
  async headers() {
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'News Scraper',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  // Performance optimizations
  experimental: {
    optimizeCss: false, // Disable CSS optimization to fix Tailwind
  },
  // Disable CSS optimization completely
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  },
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig; 