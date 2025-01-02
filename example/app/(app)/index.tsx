import Line from '@xmartlabs/react-native-line'
import { Image, StyleSheet } from 'react-native'

import Logo from '@/assets/images/logo.png'
import { LineButton } from '@/components/LineButton'
import { ThemedView } from '@/components/ThemedView'

export default function () {
  function logIn() {
    return Line.login()
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <LineButton onPress={logIn} />
    </ThemedView>
  )
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
