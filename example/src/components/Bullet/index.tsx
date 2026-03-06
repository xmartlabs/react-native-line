import { FunctionComponent } from 'react'
import { StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'

interface Props {
  body?: string
  header: string
}

export const Bullet: FunctionComponent<Props> = ({ body, header }) => (
  <View style={styles.container}>
    <ThemedText type="subtitle">{header}</ThemedText>
    <ThemedText type="default">{body}</ThemedText>
  </View>
)

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
})
