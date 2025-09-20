/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
        pathname: '/**',
      },
    ],
  },
  // Increase API body size limit
  experimental: {
    // This helps with larger payloads
    isrMemoryCacheSize: 0,
  },
  // Add API route config
  serverRuntimeConfig: {
    maxApiBodySize: '10mb',
  },
};

export default nextConfig;
