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
import { Alert } from 'react-native'

import { isWebPlatform } from '@/common/platform'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  // ⚠️ WARNING: Replace this with your own LINE Channel ID.
  useLayoutEffect(() => {
    Line.setup({
      channelId: '2006826760',
      redirectUri: isWebPlatform ? 'http://localhost:8081/' : undefined,
    }).catch(error => {
      Alert.alert('Error', error.message)
    })
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
