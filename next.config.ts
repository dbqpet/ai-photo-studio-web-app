import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Prevent Next.js from picking up a parent lockfile (e.g. ~/package-lock.json)
  // as the workspace root, which breaks module resolution in dev.
  turbopack: {
    root: projectRoot,
  },
  // Next.js 16.2 + sharp 0.35 fails to trace libvips into the Vercel function,
  // so /api/process-photo crashes on import and returns the HTML 500 page.
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/process-photo": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
  async redirects() {
    return [
      {
        source: "/introduction",
        destination: "/zh/introduction",
        permanent: true,
      },
      {
        source: "/zh-tw/:slug",
        destination: "/zh/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
