/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "h3.googleusercontent.com",
        pathname: "/a/**",
      },
    ],
  },
};

module.exports = nextConfig;
