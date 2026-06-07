import type { NextConfig } from 'next';

// GitHub Pages deploys under /Letter-Builder/
// Set GITHUB_PAGES=true in the Actions workflow to activate basePath.
const isGHPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  basePath:    isGHPages ? '/Letter-Builder' : '',
  assetPrefix: isGHPages ? '/Letter-Builder/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
