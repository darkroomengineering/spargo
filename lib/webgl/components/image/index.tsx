'use client'

import type { Ref } from 'react'
import { useImageTexture } from '@/webgl/hooks/use-image-texture'
import { type MediaHandle, TexturedPlane } from '../textured-plane'

interface ImageProps {
  src: string
  scale?: [number, number, number]
  ref?: Ref<MediaHandle>
}

export function Image({ src, scale = [1, 1, 1], ref }: ImageProps) {
  const texture = useImageTexture(src)
  const image = texture?.image as HTMLImageElement | undefined

  return (
    <TexturedPlane
      texture={texture}
      width={image?.width}
      height={image?.height}
      scale={scale}
      ref={ref}
    />
  )
}
