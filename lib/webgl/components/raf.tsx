'use client'

import { useThree } from '@react-three/fiber'
import { useFrame } from '@/hooks'

/** Drives the manual render loop: tempus tick → R3F advance (frameloop="never"). */
export function RAF({ render = true }: { render?: boolean }) {
  const advance = useThree((state) => state.advance)

  useFrame((time) => {
    if (render) advance(time / 1000)
  }, 1)

  return null
}
