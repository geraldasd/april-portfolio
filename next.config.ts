import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for styled-components (used by Sanity UI) to work with React 19
  compiler: {
    styledComponents: true,
  },
  // Transpile Sanity packages so they work correctly in the App Router SSR
  transpilePackages: ['sanity', '@sanity/ui', '@sanity/vision', 'styled-components', 'sanity-plugin-media'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Allow Sanity Studio to work in an iframe
  async headers() {
    return [
      {
        source: "/studio/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
