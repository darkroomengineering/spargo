'use client'

import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { useStore } from '@/lib/store'
import { Image, type MediaHandle } from '../image'
import { Model } from '../model'
import { Video } from '../video'

const PLACEHOLDER = '/placeholder/3.jpg'

export function Content() {
  const file = useStore((state) => state.file)
  const registerActions = useStore((state) => state.registerActions)
  const setRecording = useStore((state) => state.setRecording)

  const isVideo = file?.type.includes('video/') ?? false
  const isModel = useMemo(() => {
    const name = file?.name.toLowerCase() ?? ''
    return name.endsWith('.glb') || name.endsWith('.gltf')
  }, [file])
  const isImage = Boolean(file) && !isVideo && !isModel

  const src = useMemo(
    () => (file ? URL.createObjectURL(file) : PLACEHOLDER),
    [file]
  )
  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(src)
    }
  }, [src, file])

  const size = useThree((state) => state.size)
  const gl = useThree((state) => state.gl)
  const setSize = useThree((state) => state.setSize)

  const assetRef = useRef<MediaHandle>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    const exportImage = () => {
      const previous = { width: size.width, height: size.height }
      const width = assetRef.current?.size.width || previous.width
      const height = assetRef.current?.size.height || previous.height

      setSize(width, height)

      setTimeout(() => {
        requestAnimationFrame(() => {
          const link = document.createElement('a')
          link.download = 'dithering.png'
          link.href = gl.domElement.toDataURL()
          link.click()
          requestAnimationFrame(() => setSize(previous.width, previous.height))
        })
      }, 100)
    }

    const startRecording = () => {
      const stream = gl.domElement.captureStream(60)
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
      })
      recorderRef.current = recorder

      let chunks: Blob[] = []
      recorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data)
      })
      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        chunks = []
        const link = document.createElement('a')
        link.download = 'dithering.webm'
        link.href = URL.createObjectURL(blob)
        link.click()
      })

      recorder.start()
      setRecording(true)
    }

    const stopRecording = () => {
      recorderRef.current?.stop()
      recorderRef.current = null
      setRecording(false)
    }

    registerActions({ exportImage, startRecording, stopRecording })
  }, [gl, size.width, size.height, setSize, registerActions, setRecording])

  return (
    <>
      {(isImage || !file) && (
        <Image src={src} scale={[size.width, size.height, 0]} ref={assetRef} />
      )}
      {isVideo && (
        <Video src={src} scale={[size.width, size.height, 0]} ref={assetRef} />
      )}
      {isModel && <Model src={src} />}
    </>
  )
}
