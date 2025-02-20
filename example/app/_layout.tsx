import 'react-native-reanimated'

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import Line from '@xmartlabs/react-native-line'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'

import SpaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'
import { useColorScheme } from '@/hooks/useColorScheme'

SplashScreen.preventAutoHideAsync()

export default function () {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({ SpaceMono })

  useEffect(() => {
    if (loaded) {
      Line.setup({ channelId: '2006826760' })
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)/login" />
        <Stack.Screen name="(app)/home" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
