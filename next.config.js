/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // No env block on purpose — demo runs with zero env vars.
};

module.exports = nextConfig;
