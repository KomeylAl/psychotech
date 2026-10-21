import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  allowedDevOrigins: ['192.168.100.3'],
  experimental: {
    // Next.js otherwise rejects Server Action bodies above 1MB, before saveUpload runs.
    // Each image is still capped at 5MB. This ceiling covers a form that sends several of them.
    serverActions: {
      bodySizeLimit: '24mb',
    },
    proxyClientMaxBodySize: '24mb',
  },
};

export default nextConfig;
