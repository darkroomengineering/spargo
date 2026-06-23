'use client'

import { type Ref, useImperativeHandle } from 'react'
import { useObjectFit } from '@/hooks/use-object-fit'
import { useImageTexture } from '@/webgl/hooks/use-image-texture'

export interface MediaHandle {
  size: { width: number; height: number }
}

interface ImageProps {
  src: string
  scale?: [number, number, number]
  ref?: Ref<MediaHandle>
}

export function Image({ src, scale = [1, 1, 1], ref }: ImageProps) {
  const texture = useImageTexture(src)
  const image = texture?.image as HTMLImageElement | undefined

  const [x, y] = useObjectFit(
    scale[0],
    scale[1],
    image?.width,
    image?.height,
    'contain'
  )

  useImperativeHandle(
    ref,
    () => ({
      size: {
        width: image?.width ?? 0,
        height: image?.height ?? 0,
      },
    }),
    [image]
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
