import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Ensure proper client-side rendering
  reactStrictMode: true,
  // Optimize for Vercel deployment
  swcMinify: true,
  // Ensure proper build output
  trailingSlash: false,
};
