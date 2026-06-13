import type { NextConfig } from "next";

// Backend origin. API calls are proxied through this Next app (see rewrites
// below) so the browser always talks to its own origin — no CORS, ever, in
// dev (localhost) or prod (Vercel).
const BACKEND = "https://fluento-l2oj.onrender.com";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Don't 308-redirect /api/* to add a trailing slash — keep proxied API paths
  // exactly as the backend expects them.
  skipTrailingSlashRedirect: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND}/api/:path*` },
    ];
  },
};

export default nextConfig;
