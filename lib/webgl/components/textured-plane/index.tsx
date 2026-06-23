'use client'

import { type Ref, useImperativeHandle } from 'react'
import type { Texture } from 'three'
import { useObjectFit } from '@/hooks/use-object-fit'

export interface MediaHandle {
  size: { width: number; height: number }
}

interface TexturedPlaneProps {
  texture: Texture | undefined
  width: number | undefined
  height: number | undefined
  scale: [number, number, number]
  ref?: Ref<MediaHandle>
}

/** A contain-fitted plane carrying a texture. Shared by Image and Video. */
export function TexturedPlane({
  texture,
  width,
  height,
  scale,
  ref,
}: TexturedPlaneProps) {
  const [x, y] = useObjectFit(scale[0], scale[1], width, height, 'contain')

  useImperativeHandle(
    ref,
    () => ({ size: { width: width ?? 0, height: height ?? 0 } }),
    [width, height]
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
