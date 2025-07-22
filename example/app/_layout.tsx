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

import { SplashScreen } from '@/components/SplashScreen'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function () {
  const colorScheme = useColorScheme()

  useLayoutEffect(() => {
    Line.setup({ channelId: '2006826760' })
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SplashScreen />
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
