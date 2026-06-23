import { useEffect, useState } from 'react'
import { DefaultLoadingManager, type Texture, TextureLoader } from 'three'

const loader = new TextureLoader()

export function useImageTexture(src?: string) {
  const [texture, setTexture] = useState<Texture>()

  useEffect(() => {
    if (!src) return

    let current: Texture | undefined
    DefaultLoadingManager.itemStart(src)

    loader.load(src, (loaded) => {
      current = loaded
      setTexture(loaded)
      DefaultLoadingManager.itemEnd(src)
    })

    return () => {
      current?.dispose()
      setTexture(undefined)
    }
  }, [src])

  return texture
}
