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
  async redirects() {
    return [
      {
        source: "/introduction",
        destination: "/zh/introduction",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
