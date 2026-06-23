'use client'

import { createContext, useContext } from 'react'
import type tunnel from 'tunnel-rat'

type TunnelInstance = ReturnType<typeof tunnel>

export interface CanvasContextValue {
  WebGLTunnel: TunnelInstance
  DOMTunnel: TunnelInstance
}

export const CanvasContext = createContext<CanvasContextValue | null>(null)

export function useCanvas(): CanvasContextValue {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvas must be used within a <Canvas> provider')
  }
  return context
}
