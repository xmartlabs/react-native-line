import { FunctionComponent } from 'react'
import { PressableProps, StyleSheet } from 'react-native'

import { PressableOpacity } from '@/components/PressableOpacity'
import { ThemedText } from '@/components/ThemedText'
import { Color } from '@/constants/color'
import { useThemeColor } from '@/hooks/useThemeColor'

interface Props extends PressableProps {
  text?: string
}

export const Button: FunctionComponent<Props> = ({ onPress, text }) => {
  const backgroundColor = useThemeColor({}, 'text')

  return (
    <PressableOpacity
      onPress={onPress}
      style={[styles.container, { backgroundColor }]}>
      <ThemedText
        darkColor={Color.Black}
        lightColor={Color.White}
        type="default">
        {text}
      </ThemedText>
    </PressableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 12,
  },
})
