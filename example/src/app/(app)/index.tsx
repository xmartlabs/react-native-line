import Line, {
  type AccessToken,
  type UserProfile,
} from '@xmartlabs/react-native-line'
import { Fragment, useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, View } from 'react-native'

import { LineError } from '@/common/errors'
import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/common/localStorage'
import { ActivityBanner } from '@/components/ActivityBanner'
import { Bullet } from '@/components/Bullet'
import { Button } from '@/components/Button'
import { ThemedView } from '@/components/ThemedView'
import { Color } from '@/constants/color'

function handleError(error: LineError) {
  let header = strings.errorTitle
  let message = strings.errorMessage
  try {
    const userInfo = JSON.parse(error.userInfo?.message ?? '')
    if (userInfo.code) header = header + userInfo.code
    if (userInfo.message) message = userInfo.message
  } finally {
    return Alert.alert(header, message)
  }
}

export default function HomeScreen() {
  const [loading, setLoading] = useState<boolean>(true)
  const [token, setToken] = useState<AccessToken>()
  const [user, setUser] = useState<UserProfile>()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      Line.getProfile().then(setUser),
      Line.getCurrentAccessToken().then(setToken),
    ])
      .catch(handleError)
      .finally(() => setLoading(false))
  }, [])

  function logOut() {
    setLoading(true)
    return Line.logout()
      .then(() => {
        removeLocalStorageItem('accessToken')
      })
      .finally(() => setLoading(false))
  }

  function getFriendshipStatus() {
    setLoading(true)
    return Line.getFriendshipStatus()
      .then(result => {
        Alert.alert(strings.isFriend, String(result.friendFlag))
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  function refreshAccessToken() {
    setLoading(true)
    return Line.refreshAccessToken()
      .then(accessToken => {
        setLocalStorageItem('accessToken', accessToken.accessToken)
        setToken(accessToken)
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  function verifyAccessToken() {
    setLoading(true)
    return Line.verifyAccessToken()
      .then(result => {
        Alert.alert(result.channelId, result.expiresIn.toString())
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  return (
    <Fragment>
      <ThemedView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: user?.pictureUrl }} style={styles.image} />
          <Bullet body={user?.displayName} header={strings.name} />
          <Bullet body={user?.userId} header={strings.userId} />
          <Bullet body={token?.accessToken} header={strings.accessToken} />
        </View>
        <Button onPress={verifyAccessToken} text={strings.verifyToken} />
        <Button onPress={refreshAccessToken} text={strings.refreshToken} />
        <Button onPress={getFriendshipStatus} text={strings.isFriend} />
        <Button onPress={logOut} text={strings.logOut} />
      </ThemedView>
      {loading && <ActivityBanner />}
    </Fragment>
  )
}

const strings = {
  accessToken: 'Access Token',
  errorMessage: 'The operation could not be completed',
  errorTitle: 'Error ',
  isFriend: 'Is Friend?',
  logOut: 'Logout',
  name: 'Name',
  refreshToken: 'Refresh Token',
  userId: 'User ID',
  verifyToken: 'Verify Token',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 48,
  },
  contentContainer: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    backgroundColor: Color.Gray,
    borderColor: Color.LightGray,
    borderRadius: 100,
    borderWidth: 0.5,
    height: 200,
    resizeMode: 'cover',
    width: 200,
  },
})
