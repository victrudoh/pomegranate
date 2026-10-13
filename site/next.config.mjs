/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholder photography. Replace with your own assets or a real image host.
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;
