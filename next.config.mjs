/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.js',
      }
    }
  },
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: 'AIzaSyBiUUiBKKZS12P4qs2RJcYC_YCri8kZ4Sk',
  },
};

export default nextConfig;
