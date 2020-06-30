import React, { useEffect } from 'react'
import { Layout } from './Layout'
import { useAuth } from 'src/context/auth/provider'
import { NavigationScreenProp, NavigationRoute } from 'react-navigation'
import { login } from './actions'
import { Route } from 'src/navigation/Route'

interface HomeProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

export const Home = ({ navigation }: HomeProps) => {
  const authProps = useAuth()

  const navigateToAuthenticated = () =>
    navigation.navigate({ routeName: Route.Authenticated })

  useEffect(() => {
    if (authProps.loginResult) authProps.clearState()
  }, [])

  return (
    <Layout onPressLogin={login({ ...authProps, navigateToAuthenticated })} />
  )
}
