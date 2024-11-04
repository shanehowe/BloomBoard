/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bloomboard.blob.core.windows.net",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
