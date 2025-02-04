import { FunctionComponent } from 'react'
import { StyleSheet, Text } from 'react-native'

import { ThemedView } from '@/components/ThemedView'

interface Props {
  header: string
  text?: string
}

export const Bullet: FunctionComponent<Props> = ({ header, text }) => (
  <ThemedView style={styles.container}>
    <Text style={[styles.bold, styles.text]}>{header}</Text>
    <Text style={styles.text}>{text}</Text>
  </ThemedView>
)

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  container: {
    gap: 4,
  },
  text: {
    color: 'black',
    fontSize: 13,
  },
})
