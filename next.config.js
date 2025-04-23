/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "s3.us-west-2.amazonaws.com", // For Notion S3 images
      "prod-files-secure.s3.us-west-2.amazonaws.com", // For Notion S3 images
    ],
  },
  // SWC minification is enabled by default in Next.js 15+
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
