'use client'

import dynamic from 'next/dynamic'
import { type ReactNode, useState } from 'react'
import tunnel from 'tunnel-rat'
import { CanvasContext } from '@/webgl/hooks/use-canvas'

const WebGLCanvas = dynamic(
  () => import('./webgl').then((m) => m.WebGLCanvas),
  { ssr: false }
)

export function Canvas({ children }: { children?: ReactNode }) {
  const [WebGLTunnel] = useState(() => tunnel())
  const [DOMTunnel] = useState(() => tunnel())

  return (
    <CanvasContext.Provider value={{ WebGLTunnel, DOMTunnel }}>
      {children}
      <WebGLCanvas />
    </CanvasContext.Provider>
  )
}
