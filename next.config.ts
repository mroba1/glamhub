import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
    unoptimized: true,
  },
  // Tell Vercel to ignore the backend folder
  outputFileTracingExcludes: {
    "*": ["./backend/**/*"],
  },
};

export default nextConfig;
