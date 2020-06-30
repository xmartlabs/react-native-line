import React from 'react'

import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Route } from './Route'
import { Text } from 'react-native'
import { UserStack } from './UserStack'
import { APIStack } from './APIStack'

export const TabNavigator = createBottomTabNavigator(
  {
    [Route.UserTab]: {
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text style={{ color: tintColor }}>User</Text>
        ),
      },
      screen: UserStack,
    },
    [Route.API]: {
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text style={{ color: tintColor }}>API</Text>
        ),
      },
      screen: APIStack,
    },
  },
  {
    initialRouteName: Route.UserTab,
    lazy: false,
  },
)
