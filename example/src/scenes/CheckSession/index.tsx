import { useEffect } from 'react'
import { useAuth } from 'src/context/auth/provider'
import { Route } from 'src/navigation/Route'
import { NavigationScreenProp, NavigationRoute } from 'react-navigation'

interface HomeProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

export const CheckSession = ({ navigation }: HomeProps) => {
  const { getLoginResult } = useAuth()

  const navigateAfterCheckingSession = async () => {
    if (await getLoginResult()) navigation.navigate(Route.Authenticated)
    else navigation.navigate(Route.Unauthenticated)
  }

  useEffect(() => {
    navigateAfterCheckingSession()
  }, [])

  return null
}
