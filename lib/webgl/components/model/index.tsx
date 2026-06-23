'use client'

import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { Box3, type Group, type Mesh, MeshNormalMaterial, Vector3 } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
loader.setDRACOLoader(dracoLoader)
const material = new MeshNormalMaterial()

export function Model({ src }: { src: string }) {
  const [model, setModel] = useState<Group>()
  const camera = useThree((state) => state.camera)
  const controls = useThree((state) => state.controls) as {
    reset?: () => void
  } | null
  const viewport = useThree((state) => state.viewport)

  useEffect(() => {
    loader.load(src, ({ scene }) => setModel(scene))
  }, [src])

  useEffect(() => {
    model?.traverse((child) => {
      const mesh = child as Mesh
      if (mesh.isMesh) mesh.material = material
    })
  }, [model])

  useEffect(() => {
    const resetCamera = () => {
      controls?.reset?.()
      camera.position.set(0, 0, 5000)
      camera.lookAt(0, 0, 0)
      camera.rotation.set(0, 0, 0)
    }
    resetCamera()
    return resetCamera
  }, [model, controls, camera])

  return (
    <>
      <OrbitControls makeDefault />
      {model && (
        <group
          ref={(group) => {
            if (!group) return
            const box = new Box3().setFromObject(group)
            const { x, y } = box.getSize(new Vector3())
            const { width, height } = viewport.getCurrentViewport()
            const scale = Math.min(width / x, height / y)
            group.scale.setScalar(scale * 0.9)
          }}
        >
          <primitive object={model} />
        </group>
      )}
    </>
  )
}
