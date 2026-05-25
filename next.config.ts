import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [85, 60, 30, 10],
  },
};

export default nextConfig;
