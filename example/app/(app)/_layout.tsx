import 'react-native-reanimated'

import { Stack } from 'expo-router'

import { useListenLocalStorage } from '@/common/localStorage'
import { Spinner } from '@/components/Spinner'
import { useSplashScreen } from '@/hooks/useSplashScreen'

export default function AppLayout() {
  const ready = useSplashScreen()
  const [accessToken] = useListenLocalStorage('accessToken')

  const isLoggedIn = Boolean(accessToken)

  if (!ready) {
    return <Spinner />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  )
}
