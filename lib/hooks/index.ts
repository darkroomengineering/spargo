import { useTempus } from 'tempus/react'

// useWindowSize still ships in hamo v1.
export { useWindowSize } from 'hamo'

type FrameCallback = (
  time: number,
  deltaTime: number,
  frameCount: number
) => void

/**
 * RAF tick backed by tempus (single shared loop). Signature preserved from the
 * original hamo-based hook: useFrame(callback, priority).
 */
export function useFrame(callback: FrameCallback, priority = 0) {
  useTempus(callback, { priority })
}
