/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Allow blob URLs for image previews
    dangerouslyAllowSVG: false,
    remotePatterns: [],
    unoptimized: true,
  },
}

module.exports = nextConfig
