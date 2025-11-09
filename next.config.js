/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Allow Next.js to use WASM fallback for SWC
  experimental: {
    swcTraceProfiling: false,
  },
}

module.exports = nextConfig
