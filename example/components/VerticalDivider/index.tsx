import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Color } from '@/constants/Colors'

interface Props {
  backgroundColor?: Color
  margin?: number
  style?: StyleProp<ViewStyle>
  width?: number
}

export const VerticalDivider: React.FunctionComponent<Props> = ({
  backgroundColor,
  margin,
  style,
  width = 1,
}) => (
  <View
    style={[
      styles.container,
      {
        backgroundColor,
        marginHorizontal: margin,
        width,
      },
      style,
    ]}
  />
)

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
})
