'use client'

import { useEffect, useRef, useState } from 'react'
import { CanvasTexture, Color, NearestFilter, Vector2 } from 'three'
import { useStore } from '@/lib/store'
import { ORDERED_DITHERERS } from '@/webgl/utils/ordered-ditherers'
import { DitheringEffect } from './effect'

/**
 * Owns a single DitheringEffect instance and keeps its uniforms in sync with the
 * zustand store (driven by the DOM control panel). Replaces the old tweakpane
 * bindings entirely.
 */
export function useDitheringEffect() {
  const [effect] = useState(() => new DitheringEffect())

  const gammaCorrection = useStore((state) => state.gammaCorrection)
  const granularity = useStore((state) => state.granularity)
  const opacity = useStore((state) => state.opacity)
  const color = useStore((state) => state.color)
  const mode = useStore((state) => state.mode)

  useEffect(() => {
    effect.gammaCorrection = gammaCorrection
  }, [effect, gammaCorrection])

  useEffect(() => {
    effect.granularity = granularity
  }, [effect, granularity])

  useEffect(() => {
    effect.opacity = opacity
  }, [effect, opacity])

  const colorRef = useRef(new Color())
  useEffect(() => {
    colorRef.current.setRGB(color.r, color.g, color.b)
    effect.color = colorRef.current
  }, [effect, color])

  useEffect(() => {
    if (mode === 'RANDOM') {
      effect.random = true
      return
    }
    effect.random = false

    const ditherer = ORDERED_DITHERERS[mode]

    const buffer = document.createElement('canvas')
    buffer.width = ditherer.x
    buffer.height = ditherer.y
    const context = buffer.getContext('2d')
    if (!context) return

    const image = context.createImageData(ditherer.x, ditherer.y)
    const buffer32 = new Uint32Array(image.data.buffer)
    for (let i = 0; i < buffer32.length; i++) {
      const value = (ditherer.matrix[i] ?? 0) / ditherer.max
      const channel = Math.floor(value * 255)
      buffer32[i] = (255 << 24) | (channel << 16) | (channel << 8) | channel
    }
    context.putImageData(image, 0, 0)

    const texture = new CanvasTexture(buffer)
    texture.minFilter = NearestFilter
    texture.magFilter = NearestFilter
    texture.flipY = false
    effect.matrixTexture = texture
    effect.matrixTextureSize = new Vector2(ditherer.x, ditherer.y)

    return () => {
      texture.dispose()
    }
  }, [effect, mode])

  return effect
}
