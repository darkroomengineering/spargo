import { useThree } from '@react-three/fiber'
import { useFrame } from 'libs/hooks'

export function RAF({ render = true }) {
  const { advance } = useThree()

  useFrame((time) => {
    if (render) {
      advance(time / 1000)
    }
  }, 1)
}
