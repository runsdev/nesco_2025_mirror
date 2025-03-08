import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15MB',
    },
  },
};

export default withNextIntl(nextConfig);

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
