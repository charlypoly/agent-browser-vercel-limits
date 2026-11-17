import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
  outputFileTracingIncludes: {
    "/api/chat": [
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/playwright-core/.local-browsers/**",
    ],
  },
};

export default nextConfig;
