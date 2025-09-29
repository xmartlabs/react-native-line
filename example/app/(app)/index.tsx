import Line, {
  type AccessToken,
  type UserProfile,
} from '@xmartlabs/react-native-line'
import { useRouter } from 'expo-router'
import { Fragment, useEffect, useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet } from 'react-native'

import { LineError } from '@/common/errors'
import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/common/localStorage'
import { ActivityBanner } from '@/components/ActivityBanner'
import { Bullet } from '@/components/Bullet'
import { Button } from '@/components/Button'
import { ThemedView } from '@/components/ThemedView'

function handleError(error: LineError) {
  const userInfo = JSON.parse(error.userInfo?.message ?? '')
  const title = strings.errorTitle + userInfo.statusCode
  const message = userInfo.message ?? strings.errorMessage
  return Alert.alert(title, message)
}

export default function HomeScreen() {
  const router = useRouter()

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
        router.replace('/')
      })
      .finally(() => setLoading(false))
  }

  function getFriendshipStatus() {
    setLoading(true)
    return Line.getFriendshipStatus()
      .then(result => Alert.alert(strings.isFriend, String(result.friendFlag)))
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
      .then(result => Alert.alert(result.clientId, result.expiresIn.toString()))
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  return (
    <Fragment>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.contentContainer}>
          <Image source={{ uri: user?.pictureUrl }} style={styles.image} />
          <Bullet header={strings.name} text={user?.displayName} />
          <Bullet header={strings.userId} text={user?.userId} />
          <Bullet header={strings.accessToken} text={token?.accessToken} />
        </ThemedView>
        <Button onPress={getFriendshipStatus} text={strings.isFriend} />
        <ThemedView style={styles.row}>
          <Button onPress={verifyAccessToken} text={strings.verifyToken} />
          <Button onPress={refreshAccessToken} text={strings.refreshToken} />
        </ThemedView>
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
    alignItems: 'center',
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
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: Dimensions.get('window').width / 1.5,
    borderWidth: 0.5,
    height: Dimensions.get('window').width / 3,
    resizeMode: 'cover',
    width: Dimensions.get('window').width / 3,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
})
