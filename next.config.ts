import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com', // ✅ Unsplash
      'images.carandbike.com',
      'www.carandbike.com',
      'media.drivingelectric.com',
    ],
  },
};

export default nextConfig;
