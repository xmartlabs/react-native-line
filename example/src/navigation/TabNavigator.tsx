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
        tabBarIcon: ({ tintColor }) => (
          <Text style={{ color: tintColor }}>User</Text>
        ),
      },
      screen: UserStack,
    },
    [Route.API]: {
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Text style={{ color: tintColor }}>API</Text>
        ),
      },
      screen: APIStack,
    },
  },
  {
    initialRouteName: Route.UserTab,
    tabBarOptions: {
      showLabel: false,
    },
    lazy: false,
  },
)
