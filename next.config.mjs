import path from "node:path";

const isDev =
  process.env.npm_lifecycle_event === "dev" ||
  process.env.npm_lifecycle_event === "dev:turbo" ||
  process.argv.includes("dev");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev: put cache under node_modules/.cache to avoid Windows file-lock on ./.next
  distDir: isDev
    ? path.join("node_modules", ".cache", "wuyuan-next-dev")
    : ".next",
};

export default nextConfig;
