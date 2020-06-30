import React, { useEffect } from 'react'
import { Layout } from './Layout'
import { useAuth } from 'src/context/auth/provider'
import { Route } from 'src/navigation/Route'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { NavigationScreenProp, NavigationRoute } from 'react-navigation'
import { strings } from './strings'
import { logout } from './actions'
import { ActivityIndicator } from 'src/components/ActivityIndicator'

export interface HomeProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

export const UserProfile = ({ navigation }: HomeProps) => {
  const authProps = useAuth()

  const navigateToUnauthenticated = () =>
    navigation.navigate({ routeName: Route.Unauthenticated })

  const navigateToDetails = () =>
    navigation.navigate({ routeName: Route.UserDetails })

  useEffect(() => {
    navigation.setParams({
      onPressDetails: navigateToDetails,
      onPressLogout: logout({ ...authProps, navigateToUnauthenticated }),
    })
  }, [])

  if (authProps.loading) return <ActivityIndicator />

  return <Layout />
}

UserProfile.navigationOptions = ({ navigation }: HomeProps) => ({
  title: 'Profile',
  headerLeft: (
    <TouchableOpacity
      style={styles.logoutContainer}
      onPress={navigation.getParam('onPressLogout')}>
      <Text>{strings.logout}</Text>
    </TouchableOpacity>
  ),
  headerRight: (
    <TouchableOpacity
      style={styles.detailsContainer}
      onPress={navigation.getParam('onPressDetails')}>
      <Text>{strings.details}</Text>
    </TouchableOpacity>
  ),
})

const styles = StyleSheet.create({
  logoutContainer: {
    paddingLeft: 10,
  },
  detailsContainer: {
    paddingRight: 10,
  },
})
