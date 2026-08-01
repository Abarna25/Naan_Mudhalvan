/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:5005/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
