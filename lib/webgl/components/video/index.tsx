'use client'

import { type Ref, useImperativeHandle } from 'react'
import { useObjectFit } from '@/hooks/use-object-fit'
import { useVideoTexture } from '@/webgl/hooks/use-video-texture'
import type { MediaHandle } from '../image'

interface VideoProps {
  src: string
  scale?: [number, number, number]
  ref?: Ref<MediaHandle>
}

export function Video({ src, scale = [1, 1, 1], ref }: VideoProps) {
  const texture = useVideoTexture(src)
  const video = texture?.image as HTMLVideoElement | undefined

  const [x, y] = useObjectFit(
    scale[0],
    scale[1],
    video?.videoWidth,
    video?.videoHeight,
    'contain'
  )

  useImperativeHandle(
    ref,
    () => ({
      size: {
        width: video?.videoWidth ?? 0,
        height: video?.videoHeight ?? 0,
      },
    }),
    [video]
  )

  if (!texture) return null

  return (
    <group scale={scale}>
      <mesh scale={[x, y, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  )
}
