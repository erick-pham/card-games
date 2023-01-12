/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    // formats: ['image/avif', 'image/webp'],
    domains: ['res.cloudinary.com', 'loremflickr.com', 'i.imgur.com'],
  },
}

module.exports = nextConfig