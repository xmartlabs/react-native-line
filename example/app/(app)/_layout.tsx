import { Stack } from 'expo-router'

import { useListenLocalStorage } from '@/common/localStorage'
import { Spinner } from '@/components/Spinner'
import { useSplashScreen } from '@/hooks/useSplashScreen'

export default function AppLayout() {
  const ready = useSplashScreen()
  const [accessToken] = useListenLocalStorage('accessToken')

  if (!ready) {
    return <Spinner />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={Boolean(accessToken)}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!Boolean(accessToken)}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  )
}
