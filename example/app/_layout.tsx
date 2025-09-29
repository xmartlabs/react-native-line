import 'react-native-reanimated'

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import Line from '@xmartlabs/react-native-line'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useLayoutEffect } from 'react'

import { useColorScheme } from '@/hooks/useColorScheme'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  useLayoutEffect(() => {
    Line.setup({ channelId: '2006826760' })
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
