import { Link, Stack } from 'expo-router'
import { Fragment } from 'react'
import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function () {
  return (
    <Fragment>
      <Stack.Screen options={{ title: strings.title }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">{strings.header}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{strings.link}</ThemedText>
        </Link>
      </ThemedView>
    </Fragment>
  )
}

const strings = {
  header: "This screen doesn't exist.",
  link: 'Go to home screen!',
  title: 'Oops!',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
