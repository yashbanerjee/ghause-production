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
};

export default nextConfig;
