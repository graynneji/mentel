// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
      },
    ],
  },
  async redirects() {
    return [
      // Force the bare domain to the "www" host that every canonical tag,
      // the sitemap, and metadataBase (app/layout.tsx) already treat as
      // canonical. If Vercel's project domain settings already do this at
      // the edge, this is a harmless no-op; if they don't (or ever get
      // reconfigured), this prevents trymentel.com and www.trymentel.com
      // from being crawled as two separate, duplicate-content sites.
      {
        source: "/:path*",
        has: [{ type: "host", value: "trymentel.com" }],
        destination: "https://www.trymentel.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
      {
        // Hosted partner flow: the URL path carries a short-lived bearer
        // token, so keep it out of search indexes, out of Referer headers
        // sent to third parties, and out of shared caches. (Later entries
        // override the global X-Robots-Tag above for this path.)
        source: "/partner-session/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
