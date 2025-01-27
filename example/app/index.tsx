import { Redirect } from 'expo-router'

import { useListenLocalStorage } from '@/common/localStorage'

export default function () {
  const [accessToken] = useListenLocalStorage('accessToken')

  if (accessToken) {
    return <Redirect href="/(app)/home" />
  }

  return <Redirect href="/(app)/login" />
}
