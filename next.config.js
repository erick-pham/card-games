/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  reactStrictMode: true,
  // swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    // formats: ['image/avif', 'image/webp'],
    domains: ['res.cloudinary.com', 'loremflickr.com', 'i.imgur.com'],
  },
})