import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "vvhyysizqdlmmsfxzled.supabase.co",
        pathname: "/storage/v1/object/public/game-images/**",
      },
    ],
  },
};

export default nextConfig;