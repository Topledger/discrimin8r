/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
        domains: ["lh3.googleusercontent.com"],
    },
    env: {
        // Only include public configuration - no credentials needed for public bucket
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        AWS_REGION: process.env.AWS_REGION,
    },
    experimental: {
        // newNextLinkBehavior: true,
    },
};

module.exports = nextConfig;
