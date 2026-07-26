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
  // GitHub Pages 仅支持静态文件，生产构建导出到 out/
  ...(isDev ? {} : { output: "export" }),
};

export default nextConfig;
