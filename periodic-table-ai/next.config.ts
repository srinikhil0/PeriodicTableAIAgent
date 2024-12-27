import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/favicon/:path*',
        destination: '/public/favicon/:path*'
      }
    ];
  }
};

export default config;
