import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { strings } from './strings'
import { useAuth } from 'src/context/auth/provider'

export const Layout = () => {
  const { loginResult } = useAuth()
  const { userProfile } = loginResult!
  return (
    <View style={styles.container}>
      <Text style={styles.displayName}>{userProfile!.displayName}</Text>
      <Text style={styles.statusMessage}>
        {strings.status}
        {userProfile!.statusMessage ? userProfile!.statusMessage : strings.n_a}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  displayName: {
    fontWeight: 'bold',
  },
  statusMessage: {
    color: 'gray',
  },
  logoutContainer: {
    paddingLeft: 10,
  },
  detailsContainer: {
    paddingRight: 10,
  },
})
