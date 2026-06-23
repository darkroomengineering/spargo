import { useMemo } from 'react'

type ObjectFit = 'cover' | 'contain'

/**
 * Returns [scaleX, scaleY] to fit a child of (childWidth × childHeight) inside a
 * parent of (parentWidth × parentHeight) using `cover` or `contain` semantics.
 */
export function useObjectFit(
  parentWidth = 1,
  parentHeight = 1,
  childWidth = 1,
  childHeight = 1,
  objectFit: ObjectFit = 'cover'
): [number, number] {
  return useMemo(() => {
    if (!parentWidth || !parentHeight || !childWidth || !childHeight)
      return [1, 1]

    const parentRatio = parentWidth / parentHeight
    const childRatio = childWidth / childHeight

    let width: number
    if (objectFit === 'contain') {
      width = parentRatio > childRatio ? parentHeight * childRatio : parentWidth
    } else {
      width = parentRatio > childRatio ? parentWidth : parentHeight * childRatio
    }

    const height = width / childRatio
    const fitX = parentWidth / width
    const fitY = parentHeight / height

    return [1 / fitX, 1 / fitY]
  }, [parentWidth, parentHeight, childWidth, childHeight, objectFit])
}
