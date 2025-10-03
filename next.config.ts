import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["firebasestorage.googleapis.com"], // adaugă aici Firebase Storage
    qualities: [10, 25, 50, 60, 75, 100], 
  },

};

export default nextConfig;
