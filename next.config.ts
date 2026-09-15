import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'transformtoliberation.com' },
      { protocol: 'https', hostname: 'www.transformtoliberation.com' },
      { protocol: 'https', hostname: 'api.transformtoliberation.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
    ],
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
  },
  // The moderation queue, voice review and photo management pages were merged into
  // the central publications dashboard. Kept as redirects so existing links survive.
  async redirects() {
    return [
      {
        source: '/dashboard/moderation-queue',
        destination: '/dashboard/publications',
        permanent: false,
      },
      {
        source: '/dashboard/moderation-queue/:id',
        destination: '/dashboard/publications/:id',
        permanent: false,
      },
      {
        source: '/dashboard/voice-review',
        destination: '/dashboard/publications',
        permanent: false,
      },
      {
        source: '/dashboard/photo-management',
        destination: '/dashboard/publications/cover-library',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
