import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { themes } from '@/styles/colors'
import { fontsVariable } from '@/styles/fonts'

const APP_BASE_URL = 'https://spargo.darkroom.engineering'
const APP_NAME = 'Spargo'
const APP_DEFAULT_TITLE = 'Spargo'
const APP_TITLE_TEMPLATE = '%s — Spargo'
const APP_DESCRIPTION =
  'Real-time GPU image dithering in the browser, via WebGL. Drop an image and scatter pixels to simulate tone and shade. By darkroom.engineering.'

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'dithering',
    'webgl',
    'gpu',
    'image',
    'bayer',
    'ordered dithering',
  ],
  alternates: { canonical: '/' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: { default: APP_DEFAULT_TITLE, template: APP_TITLE_TEMPLATE },
    description: APP_DESCRIPTION,
    url: APP_BASE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: { default: APP_DEFAULT_TITLE, template: APP_TITLE_TEMPLATE },
    description: APP_DESCRIPTION,
  },
  authors: [
    { name: 'darkroom.engineering', url: 'https://darkroom.engineering' },
  ],
}

export const viewport: Viewport = {
  themeColor: themes.dark.primary,
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontsVariable} data-theme="dark">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
