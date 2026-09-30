import 'react-native-reanimated'

import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Fragment } from 'react'

export default function RootLayout() {
  return (
    <Fragment>
      <Slot />
      <StatusBar style="auto" />
    </Fragment>
  )
}
