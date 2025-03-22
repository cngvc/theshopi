/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ]
  },
  compiler: {
    removeConsole: true
  },
  experimental: {},
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  }
};

module.exports = nextConfig;
