import 'react-native-reanimated'

import { useFonts } from 'expo-font'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { FunctionComponent, useEffect } from 'react'

import SpaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'

ExpoSplashScreen.preventAutoHideAsync()

export const SplashScreen: FunctionComponent = () => {
  const [loaded] = useFonts({ SpaceMono })

  useEffect(() => {
    if (loaded) {
      ExpoSplashScreen.hideAsync()
    }
  }, [loaded])

  return null
}
