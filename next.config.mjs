/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true, // optional: don’t block build on eslint errors
  },

  typescript: {
    ignoreBuildErrors: true, // optional: don’t block build on TS errors
  },

  images: {
    unoptimized: true, // fine for Vercel if you don’t need Image Optimization
  },
};

export default nextConfig;
