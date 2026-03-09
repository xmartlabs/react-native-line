import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { Color } from '@/constants/color'

export function Spinner(props: ActivityIndicatorProps) {
  return <ActivityIndicator color={Color.Green} {...props} />
}
