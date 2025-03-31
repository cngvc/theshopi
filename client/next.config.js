/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  logging: {
    fetches: {
      fullUrl: true
    }
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ]
  },
  compiler: {},
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.devtool = 'source-map';
    }
    config.resolve.fallback = { fs: false };
    return config;
  }
};

module.exports = nextConfig;
