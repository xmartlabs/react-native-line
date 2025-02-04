import { FunctionComponent } from 'react'
import { PressableProps, StyleSheet, Text } from 'react-native'

import { PressableOpacity } from '../PressableOpacity'

interface Props extends PressableProps {
  text?: string
}

export const Button: FunctionComponent<Props> = ({ onPress, text }) => (
  <PressableOpacity onPress={onPress} style={styles.container}>
    <Text style={styles.text}>{text}</Text>
  </PressableOpacity>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderRadius: 16,
    padding: 12,
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
})
