/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/domestic", destination: "/domestic.html" },
      { source: "/spiritual", destination: "/spiritual.html" },
      { source: "/detail", destination: "/detail.html" },
      { source: "/contact", destination: "/contact.html" },
      { source: "/about", destination: "/about.html" },
      { source: "/packages", destination: "/packages.html" },
    ];
  },
};
module.exports = nextConfig;
