import React, { FunctionComponent } from 'react'
import { Image, StyleSheet, Text } from 'react-native'

import Line from '@/assets/images/line.png'
import { PressableOpacity } from '@/components/PressableOpacity'
import { VerticalDivider } from '@/components/VerticalDivider'
import { Color } from '@/constants/color'

interface Props {
  disabled?: boolean
  onPress?: VoidFunction
  size?: number
}

export const LineButton: FunctionComponent<Props> = ({
  disabled = false,
  onPress,
}) => {
  const backgroundColor = disabled ? Color.White : Color.Green
  const lineColor = disabled ? Color.LightGray60PCT : Color.Black8PCT
  const textColor = disabled ? Color.Gray20PCT : Color.White
  const tintColor = disabled ? Color.Gray20PCT : Color.White

  const borderWidth = disabled ? 1 : 0

  return (
    <PressableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, { backgroundColor, borderWidth }]}>
      <Image source={Line} style={[styles.image, { tintColor }]} />
      <VerticalDivider backgroundColor={lineColor} />
      <Text style={[styles.text, { color: textColor }]}>{strings.text}</Text>
    </PressableOpacity>
  )
}

const strings = {
  text: 'Log In',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Color.LightGray60PCT,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    padding: 4,
  },
  image: {
    height: 50,
    width: 50,
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
