import { Home } from 'src/scenes/Home'
import { Route } from './Route'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { CheckSession } from 'src/scenes/CheckSession/index'
import { AuthenticatedStack } from './AuthenticatedStack'

export const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      [Route.Authenticated]: AuthenticatedStack,
      [Route.Unauthenticated]: Home,
      [Route.CheckSession]: CheckSession,
    },
    {
      initialRouteName: Route.CheckSession,
    },
  ),
)
