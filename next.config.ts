import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  siteUrl: 'https://nesco.id',
  generateRobotsTxt: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100MB',
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
};

export default withNextIntl(nextConfig);

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
