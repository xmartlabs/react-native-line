import { FunctionComponent } from 'react'
import { Pressable, PressableProps, StyleSheet } from 'react-native'

export const PressableOpacity: FunctionComponent<PressableProps> = ({
  accessibilityRole = 'button',
  hitSlop = 16,
  style,
  ...rest
}) => (
  <Pressable
    accessibilityRole={accessibilityRole}
    hitSlop={hitSlop}
    style={state => [
      state.pressed && styles.opacity,
      typeof style === 'function' ? style(state) : style,
    ]}
    {...rest}
  />
)

const styles = StyleSheet.create({
  opacity: {
    opacity: 0.5,
  },
})
