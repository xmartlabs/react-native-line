declare module '*.png' {
  const content: any
  export default content
}

declare module '*.jpg' {
  const content: any
  export default content
}

declare module '*.jpeg' {
  const content: any
  export default content
}

declare module '*.gif' {
  const content: any
  export default content
}

declare module '*.svg' {
  import type { FunctionComponent } from 'react'
  import type { SvgProps } from 'react-native-svg'
  const content: FunctionComponent<SvgProps>
  export default content
}

declare module '*.ttf' {
  const value: import('expo-font').FontSource
  export default value
}
