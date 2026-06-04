import { useEffect, useState } from 'react'
import { useTempus } from 'tempus/react'

// useWindowSize + useMediaQuery still ship in hamo v1; the other hooks spargo
// used were dropped in v1, so they're reimplemented below.
export { useMediaQuery, useWindowSize } from 'hamo'

// Replaces @studio-freight/hamo's useFrame — now backed by tempus/react.
// Signature preserved: useFrame(callback, priority). Callback receives
// (time, deltaTime, frameCount) from tempus.
export function useFrame(callback, priority = 0) {
  useTempus(callback, { priority })
}

// Replaces @studio-freight/hamo's useDebug — true in development or with ?debug.
export function useDebug() {
  const [debug, setDebug] = useState(false)

  useEffect(() => {
    setDebug(
      process.env.NODE_ENV === 'development' ||
        new URLSearchParams(window.location.search).has('debug'),
    )
  }, [])

  return debug
}
