declare module '*.css'

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.svg' {
  import type { FC, SVGProps } from 'react'

  const ReactComponent: FC<SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.glsl' {
  const content: string
  export default content
}
