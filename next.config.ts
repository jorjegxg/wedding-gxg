import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["firebasestorage.googleapis.com"], // adaugă aici Firebase Storage
  },

};

export default nextConfig;
