import { useFonts } from 'expo-font'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

import SpaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'

import { useReactNativeLine } from './useReactNativeLine'

ExpoSplashScreen.preventAutoHideAsync()
ExpoSplashScreen.setOptions({ duration: 200, fade: true })

export const useSplashScreen = () => {
  const [loadedSpaceMono] = useFonts({ SpaceMono })
  const reactNativeLineReady = useReactNativeLine()

  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    if (loadedSpaceMono && reactNativeLineReady) {
      setReady(true)
      ExpoSplashScreen.hide()
    }
  }, [loadedSpaceMono, reactNativeLineReady])

  return ready
}
