import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Directory containing this config (admin-panel), not the monorepo root with the other lockfile. */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Monorepo: parent folder has its own package-lock.json; without this, Turbopack resolves from the
  // wrong root (tailwindcss/prisma paths break) and Next prints a lockfile warning.
  turbopack: {
    root: turbopackRoot,
  },
  // @ts-ignore - NextJS internal property for dev host whitelist
  allowedDevOrigins: ['192.168.1.8', 'localhost:3000'],
  // assetPrefix removed to prevent 404 on direct Vercel URLs and main domain proxying.
  // CORS is set per route via getCorsHeaders() so apex (ghausglobal.com) and www both work.
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_PUBLIC_DOMAIN: process.env.R2_PUBLIC_DOMAIN,
  },
};

export default nextConfig;
