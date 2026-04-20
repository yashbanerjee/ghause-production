import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - NextJS internal property for dev host whitelist
  allowedDevOrigins: ['192.168.1.8', 'localhost:3000'],
  // assetPrefix removed to prevent 404 on direct Vercel URLs and main domain proxying.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://www.ghausglobal.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cache-Control, Pragma, Expires",
          },
        ]
      }
    ];
  },
};

export default nextConfig;
