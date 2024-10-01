/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com"],
  },
  experimental: {
    newNextLinkBehavior: true,
  },
};

module.exports = nextConfig;
