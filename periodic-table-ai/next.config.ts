import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  distDir: 'src',
  images: {
    unoptimized: true
  }
};

export default config;
