import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              memo: true,
              dimensions: false,
              svgoConfig: {
                multipass: true,
                plugins: [
                  'removeDimensions',
                  'cleanupIds',
                  'prefixIds',
                  { name: 'convertPathData', params: { floatPrecision: 1 } },
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  experimental: {
    optimizePackageImports: [
      '@react-three/drei',
      '@react-three/fiber',
      'three',
      '@base-ui/react',
      'zustand',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ],
    },
  ],
  redirects: async () => [
    { source: '/home', destination: '/', permanent: true },
  ],
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
