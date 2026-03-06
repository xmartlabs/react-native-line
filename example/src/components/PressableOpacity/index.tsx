import * as Haptics from 'expo-haptics'
import { FunctionComponent } from 'react'
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native'

interface Props extends PressableProps {
  haptics?: Haptics.ImpactFeedbackStyle
}

export const PressableOpacity: FunctionComponent<Props> = ({
  accessibilityRole = 'button',
  haptics = Haptics.ImpactFeedbackStyle.Light,
  hitSlop = 16,
  onPress,
  style,
  ...rest
}) => {
  function handlePress(event: GestureResponderEvent) {
    if (!onPress) return
    Haptics.impactAsync(haptics)
    onPress(event)
  }

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      hitSlop={hitSlop}
      onPress={handlePress}
      style={state => [
        state.pressed && styles.opacity,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  opacity: {
    opacity: 0.5,
  },
})
