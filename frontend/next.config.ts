import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '172.20.0.5'],
}

export default nextConfig;
