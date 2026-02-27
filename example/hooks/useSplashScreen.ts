import { useFonts } from 'expo-font'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

import SpaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'

ExpoSplashScreen.preventAutoHideAsync()
ExpoSplashScreen.setOptions({ duration: 200, fade: true })

export const useSplashScreen = () => {
  const [loadedSpaceMono] = useFonts({ SpaceMono })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loadedSpaceMono) {
      setReady(true)
      ExpoSplashScreen.hide()
    }
  }, [loadedSpaceMono])

  return ready
}
