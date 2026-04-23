import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - NextJS internal property for dev host whitelist
  allowedDevOrigins: ['192.168.1.8', 'localhost:3000'],
  // assetPrefix removed to prevent 404 on direct Vercel URLs and main domain proxying.
  // CORS is set per route via getCorsHeaders() so apex (ghausglobal.com) and www both work.
};

export default nextConfig;
