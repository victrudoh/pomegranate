/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No remote image hosts are configured. All project visuals are local files
  // in public/projects, so nothing is fetched from a third party at runtime and
  // there are no remote images to lose or rate-limit.
};

export default nextConfig;
