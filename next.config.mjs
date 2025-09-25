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
  // API configuration for larger uploads
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
  // Output configuration for Vercel
  output: 'standalone',
};

export default nextConfig;
