import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { strings } from './strings'
import image from 'assets/image.png'
import logo from 'assets/rn-line-logo.png'
import { LineButton } from 'src/components/LineButton'
import { typography } from 'src/styles/typography'

export const Layout = ({ onPressLogin }: { onPressLogin: () => void }) => (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image source={logo} style={styles.logo} />
    </View>
    <Text style={styles.message}>{strings.demo}</Text>
    <View style={styles.imageContainer}>
      <Image source={image} style={styles.image} />
    </View>
    <View style={styles.buttonContainer}>
      <LineButton title={strings.lineLoginButton} onPress={onPressLogin} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  errorMessage: {
    marginBottom: 50,
    padding: 20,
  },
  image: { transform: [{ scale: 0.9 }] },
  imageContainer: {
    flex: 1,
    overflow: 'visible',
  },
  logo: { alignSelf: 'flex-start', transform: [{ scale: 0.25 }] },
  logoContainer: { flex: 0.5, justifyContent: 'center', overflow: 'visible' },
  message: {
    ...typography.h2,
    marginTop: -20,
    marginBottom: 20,
  },
})
