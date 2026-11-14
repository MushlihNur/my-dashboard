import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/share/[token]/file": ["./node_modules/.pnpm/**/@img/sharp-libvips-linux-x64/**/*"],
  },
};

export default nextConfig;
