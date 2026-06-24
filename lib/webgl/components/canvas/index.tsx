'use client'

import dynamic from 'next/dynamic'

// R3F is client-only; ssr:false keeps it out of the server render.
const WebGLCanvas = dynamic(
  () => import('./webgl').then((m) => m.WebGLCanvas),
  { ssr: false }
)

export function Canvas() {
  return <WebGLCanvas />
}
