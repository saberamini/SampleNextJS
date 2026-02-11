/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for development
  reactStrictMode: true,

  // Output standalone build for Docker deployment
  output: 'standalone',

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
