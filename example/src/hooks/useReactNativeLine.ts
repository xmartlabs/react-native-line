import Line from '@xmartlabs/react-native-line'
import { useLayoutEffect, useState } from 'react'
import { Alert } from 'react-native'

import { isWebPlatform } from '@/common/platform'

export const useReactNativeLine = () => {
  const [ready, setReady] = useState<boolean>(false)

  // ⚠️ WARNING: Replace this with your own LINE Channel ID.
  useLayoutEffect(() => {
    Line.setup({
      channelId: '2006826760',
      redirectUri: isWebPlatform ? 'http://localhost:8081/' : undefined,
    })
      .then(() => setReady(true))
      .catch(error => Alert.alert('Error', error.message))
  }, [])

  return ready
}
