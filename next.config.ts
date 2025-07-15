import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    PUBLIC_API_BASE_URL: process.env.PUBLIC_API_BASE_URL,
    PUBLIC_API_KEY: process.env.PUBLIC_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'prueba-tecnica-api-tienda-moviles.onrender.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'prueba-tecnica-api-tienda-moviles.onrender.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.apple.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
