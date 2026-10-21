import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default config;
