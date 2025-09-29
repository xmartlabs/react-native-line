import { useFonts } from 'expo-font'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

import SpaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'

ExpoSplashScreen.preventAutoHideAsync()

export const useSplashScreen = () => {
  const [loaded] = useFonts({ SpaceMono })
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    if (loaded) {
      ExpoSplashScreen.hideAsync()
      setReady(true)
    }
  }, [loaded])

  return ready
}
