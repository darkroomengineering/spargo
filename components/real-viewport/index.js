import { useEffect } from 'react'

// Replaces @studio-freight/compono's RealViewport: keeps the viewport-unit CSS
// custom properties (--vw/--vh/--svh/--lvh/--dvh) in sync on resize. spargo's
// styles consume --svh.
export function RealViewport() {
  useEffect(() => {
    function onResize() {
      const vw = window.innerWidth * 0.01
      const vh = window.innerHeight * 0.01
      const root = document.documentElement.style
      root.setProperty('--vw', `${vw}px`)
      root.setProperty('--vh', `${vh}px`)
      root.setProperty('--svh', `${vh}px`)
      root.setProperty('--lvh', `${vh}px`)
      root.setProperty('--dvh', `${vh}px`)
    }

    onResize()
    window.addEventListener('resize', onResize, false)

    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  return null
}
