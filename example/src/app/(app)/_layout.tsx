import { Stack } from 'expo-router'

import { useSession } from '@/common/localStorage'
import { Spinner } from '@/components/Spinner'
import { useSplashScreen } from '@/hooks/useSplashScreen'

export default function AppLayout() {
  const [session] = useSession()
  const ready = useSplashScreen()

  if (!ready) {
    return <Spinner />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  )
}
