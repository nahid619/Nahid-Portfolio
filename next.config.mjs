/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow SVG files from Cloudinary (needed for skill icons)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'none'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
