'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { HalfFloatType } from 'three'
import { useWindowSize } from '@/hooks'
import { useDitheringEffect } from './effects/dithering'

export function PostProcessing() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const dpr = useThree((state) => state.viewport.dpr)

  const isWebgl2 = gl.capabilities.isWebGL2
  const maxSamples = gl.capabilities.maxSamples
  const needsAA = dpr < 2

  const composer = useMemo(
    () =>
      new EffectComposer(gl, {
        multisampling: isWebgl2 && needsAA ? maxSamples : 0,
        frameBufferType: HalfFloatType,
      }),
    [gl, needsAA, isWebgl2, maxSamples]
  )

  const renderPass = useMemo(
    () => new RenderPass(scene, camera),
    [scene, camera]
  )

  const ditheringEffect = useDitheringEffect()
  const ditheringPass = useMemo(
    () => new EffectPass(camera, ditheringEffect),
    [camera, ditheringEffect]
  )

  useEffect(() => {
    composer.addPass(renderPass)
    composer.addPass(ditheringPass)

    return () => {
      composer.removePass(renderPass)
      composer.removePass(ditheringPass)
    }
  }, [composer, renderPass, ditheringPass])

  const { width, height } = useWindowSize()
  useEffect(() => {
    if (width && height) composer.setSize(width, height)
  }, [composer, width, height])

  useFrame((_, deltaTime) => {
    composer.render(deltaTime)
  }, 1)

  return null
}
