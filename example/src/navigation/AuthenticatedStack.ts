import { createStackNavigator } from 'react-navigation-stack'
import { Route } from './Route'
import { TabNavigator } from './TabNavigator'

export const AuthenticatedStack = createStackNavigator(
  {
    [Route.TabNavigator]: TabNavigator,
  },
  {
    initialRouteName: Route.TabNavigator,
    headerMode: 'none',
  },
)
