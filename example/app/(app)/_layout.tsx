import 'react-native-reanimated'

import { Stack } from 'expo-router'

import { useListenLocalStorage } from '@/common/localStorage'

export default function AppLayout() {
  const [accessToken] = useListenLocalStorage('accessToken')

  const isLoggedIn = Boolean(accessToken)

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
