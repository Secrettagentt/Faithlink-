// import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  // output: "export",
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   optimizeFonts: true,
  //   optimizeImages: true,
  //   optimizeCss: true,
  //   // appDir: false,
  //   // esmExternals: "loose",
  // },
  webpack: (config) => {
    config.optimization.minimize = true;
    return config;
  },
};

module.exports = nextConfig;
// export default nextConfig;
