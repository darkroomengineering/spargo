import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

const SITE_URL = 'https://spargo.darkroom.engineering'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Spargo — GPU Image Dithering',
  description:
    'Real-time GPU image dithering in the browser, via WebGL. Drop an image and scatter pixels to simulate tone and shade. By Darkroom Engineering.',
  applicationName: 'Spargo',
  authors: [
    { name: 'Darkroom Engineering', url: 'https://darkroom.engineering' },
  ],
  keywords: [
    'dithering',
    'webgl',
    'gpu',
    'image',
    'bayer',
    'ordered dithering',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Spargo — GPU Image Dithering',
    description:
      'Real-time GPU image dithering in the browser, via WebGL. By Darkroom Engineering.',
    siteName: 'Spargo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spargo — GPU Image Dithering',
    description: 'Real-time GPU image dithering in the browser, via WebGL.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
