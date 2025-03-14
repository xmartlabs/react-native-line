import Line from '@xmartlabs/react-native-line'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { Fragment, useState } from 'react'
import { Alert, Image, StyleSheet } from 'react-native'

import Logo from '@/assets/images/logo.png'
import { setLocalStorageItem } from '@/common/localStorage'
import { ActivityBanner } from '@/components/ActivityBanner'
import { LineButton } from '@/components/LineButton'
import { ThemedView } from '@/components/ThemedView'

export default function () {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  function logIn() {
    setLoading(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    return Line.login()
      .then(result => {
        if (!result.accessToken.accessToken) return
        setLocalStorageItem('accessToken', result.accessToken.accessToken)
        router.replace('/home')
      })
      .catch(() => {
        Alert.alert(strings.errorTitle, strings.errorMessage)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Fragment>
      <ThemedView style={styles.container}>
        <Image source={Logo} style={styles.logo} />
        <LineButton onPress={logIn} />
      </ThemedView>
      {loading && <ActivityBanner />}
    </Fragment>
  )
}

const strings = {
  errorMessage: 'Failed to log in',
  errorTitle: 'Error',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    height: 112,
    resizeMode: 'contain',
  },
})
