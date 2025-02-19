import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
    ignoreBuildErrors: true,  
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        // port: '',
        // pathname: '/account123/**',
      },
      {
        protocol: 'https',
        hostname: 'static.fnac-static.com',
        // port: '',
        // pathname: '/account123/**',
      },
    ]
  }

    

};

export default nextConfig;
