import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/medidiet',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
