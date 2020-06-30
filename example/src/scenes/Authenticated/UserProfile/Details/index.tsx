import React from 'react'
import { SectionList, View } from 'react-native'
import { useAuth } from 'src/context/auth/provider'
import { styles } from './styles'
import {
  renderSectionItem,
  renderSectionHeader,
  keyExtractor,
} from 'src/scenes/Authenticated/API/InfoList'

export const UserDetails = () => {
  const { loginResult } = useAuth()
  const { accessToken, userProfile } = loginResult!
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {
            title: 'User',
            data: [
              { title: 'Display name', value: userProfile!.displayName },
              {
                title: 'Status message',
                value: userProfile!.statusMessage || 'N/A',
              },
              { title: 'UserID', value: userProfile!.userID || 'N/A' },
              { title: 'Avatar URL', value: userProfile!.pictureURL || 'N/A' },
            ],
          },
          {
            title: 'Token',
            data: [
              { title: 'Access', value: accessToken.access_token },
              { title: 'Created', value: accessToken.createdAt },
              { title: 'Expire', value: accessToken.expires_in },
              { title: 'Permissions', value: accessToken.scope },
            ],
          },
        ]}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader as any}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}
