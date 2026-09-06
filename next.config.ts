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
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
