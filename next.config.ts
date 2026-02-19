import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for styled-components (used by Sanity UI) to work with React 19
  compiler: {
    styledComponents: true,
  },
  images: {
    // Sanity CDN handles format conversion, resizing & quality via the
    // custom loader — disable Next.js's built-in image optimiser entirely.
    unoptimized: true,
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
