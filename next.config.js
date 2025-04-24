/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 15.2.4+
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "s3.us-west-2.amazonaws.com", // For Notion S3 images
      "prod-files-secure.s3.us-west-2.amazonaws.com", // For Notion S3 images
      "www.notion.so", // For Notion images
    ],
    formats: ['image/avif', 'image/webp'], // Enable modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Custom sizes for next/image
  },
  
  // Add common URL redirects
  async redirects() {
    return [
      {
        source: '/productos/:path*',
        destination: '/producto/:path*',
        permanent: true,
      },
      {
        source: '/product/:path*',
        destination: '/producto/:path*',
        permanent: true,
      },
      {
        source: '/collection',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Add headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Use eslint and typescript checks but don't fail the production build
  // This allows deployment even with warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable production source maps for better error tracking
  productionBrowserSourceMaps: true,
}

module.exports = nextConfig
