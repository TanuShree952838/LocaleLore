import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */

// Static security headers applied to every route. The Content-Security-Policy
// is intentionally NOT set here — it is generated per-request with a fresh
// nonce in middleware.ts (see the strict, nonce-based CSP there).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the tracing root to this app so the nested `localelore/` project (with
  // its own lockfile) doesn't confuse Vercel's serverless bundle tracing.
  outputFileTracingRoot: __dirname,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
