import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Turbopack configuration
  turbopack: {
    resolveAlias: {
      // sql.js needs these Node.js modules to be stubbed in browser
      fs: { browser: "./src/lib/empty-module.ts" },
      path: { browser: "./src/lib/empty-module.ts" },
      crypto: { browser: "./src/lib/empty-module.ts" },
    },
  },
  // Ensure sql.js wasm files can be loaded
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
