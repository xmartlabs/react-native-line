import { createStackNavigator } from 'react-navigation-stack'
import { Route } from './Route'
import { UserDetails } from 'src/scenes/Authenticated/UserProfile/Details'
import { UserProfile } from 'src/scenes/Authenticated/UserProfile'

export const UserStack = createStackNavigator(
  {
    [Route.UserTab]: UserProfile,
    [Route.UserDetails]: UserDetails,
  },
  {
    initialRouteName: Route.UserTab,
  },
)
