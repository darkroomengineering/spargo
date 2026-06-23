import { useEffect, useState } from 'react'
import { DefaultLoadingManager, VideoTexture } from 'three'

export function useVideoTexture(src?: string) {
  const [texture, setTexture] = useState<VideoTexture>()

  useEffect(() => {
    if (!src) return

    let current: VideoTexture | undefined
    DefaultLoadingManager.itemStart(src)

    const video = document.createElement('video')
    video.src = src
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.autoplay = true
    video.playsInline = true
    void video.play()

    video.addEventListener(
      'loadedmetadata',
      () => {
        current = new VideoTexture(video)
        setTexture(current)
        DefaultLoadingManager.itemEnd(src)
      },
      { once: true }
    )

    return () => {
      current?.dispose()
      video.pause()
      video.removeAttribute('src')
      setTexture(undefined)
    }
  }, [src])

  return texture
}
