import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${process.env.BACKEND_URL ?? "https://38ac-154-160-23-186.ngrok-free.app"}/:path*` }];
  },
};

export default nextConfig;
