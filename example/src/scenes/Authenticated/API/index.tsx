import React from 'react'

import { View, SectionList, TouchableOpacity, Text } from 'react-native'
import { Route } from 'src/navigation/Route'
import { styles } from './styles'
import { keyExtractor } from './InfoList'
import { NavigationScreenProp, NavigationRoute } from 'react-navigation'

interface HomeProps {
  navigation: NavigationScreenProp<NavigationRoute>
}

interface TouchableItem {
  title: string
  subtitle: string
  route: Route
}

interface TouchableSectionItem {
  item: TouchableItem
}

export const API = ({ navigation }: HomeProps) => {
  const onPressItem = (route: Route) => () => navigation.navigate(route)
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {
            title: 'User',
            data: [
              {
                title: 'Get user profile',
                subtitle: 'getProfile',
                route: Route.API_GetProfile,
              },
              {
                title: 'Get current access token information',
                subtitle: 'getCurrentAccessToken',
                route: Route.API_GetCurrentAccessToken,
              },
              {
                title: 'Refresh current access token',
                subtitle: 'refreshToken',
                route: Route.API_RefreshToken,
              },
              {
                title: 'Verify current access token',
                subtitle: 'verifyAccessToken',
                route: Route.API_VerifyAccessToken,
              },
            ],
          },
        ]}
        renderItem={renderSectionItem(onPressItem)}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}

export const renderSectionItem = (
  onPressItem: (route: Route) => () => void,
) => ({ item }: TouchableSectionItem) => (
  <View style={styles.apiItemContainer}>
    <TouchableOpacity onPress={onPressItem(item.route)}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  </View>
)
