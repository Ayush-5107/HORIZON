/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/HORIZON',
  assetPrefix: '/HORIZON/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
