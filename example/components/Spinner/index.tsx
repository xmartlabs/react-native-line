import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { Color } from '@/constants/Colors'

export function Spinner(props: ActivityIndicatorProps) {
  return <ActivityIndicator color={Color.Green} {...props} />
}
