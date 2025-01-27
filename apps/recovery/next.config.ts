import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'icons.llamao.fi',
      },
    ],
  },
  typescript: {
    // TODO: delete this after fixing the react version compatibility issue
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
