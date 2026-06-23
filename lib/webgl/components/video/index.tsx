'use client'

import type { Ref } from 'react'
import { useVideoTexture } from '@/webgl/hooks/use-video-texture'
import { type MediaHandle, TexturedPlane } from '../textured-plane'

interface VideoProps {
  src: string
  scale?: [number, number, number]
  ref?: Ref<MediaHandle>
}

export function Video({ src, scale = [1, 1, 1], ref }: VideoProps) {
  const texture = useVideoTexture(src)
  const video = texture?.image as HTMLVideoElement | undefined

  return (
    <TexturedPlane
      texture={texture}
      width={video?.videoWidth}
      height={video?.videoHeight}
      scale={scale}
      ref={ref}
    />
  )
}
