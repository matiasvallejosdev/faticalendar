import { SITE } from './src/config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use SITE config for various Next.js settings
  env: {
    SITE_NAME: SITE.name,
    SITE_TITLE: SITE.title,
    SITE_DESCRIPTION: SITE.description,
    SITE_KEYWORDS: SITE.keywords,
    SITE_ORIGIN: SITE.origin,
  },
  // Enable metadata API
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Configure redirects if needed
  async rewrites() {
    return [];
  },
  // Configure headers for SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
}

export default nextConfig
