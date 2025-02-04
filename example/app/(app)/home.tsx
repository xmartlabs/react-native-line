import Line, { AccessToken, UserProfile } from '@xmartlabs/react-native-line'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native'

import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/common/localStorage'
import { Bullet } from '@/components/Bullet'
import { Button } from '@/components/Button'
import { ThemedView } from '@/components/ThemedView'

function handleError(error: any) {
  return Alert.alert(strings.errorTitle, error?.message ?? strings.errorMessage)
}

export default function () {
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
    return Line.logout().then(() => {
      removeLocalStorageItem('accessToken')
      router.replace('/login')
    })
  }

  function getFriendshipStatus() {
    return Line.getFriendshipStatus()
      .then(result => Alert.alert(strings.isFriend, String(result.friendFlag)))
      .catch(handleError)
  }

  function refreshAccessToken() {
    return Line.refreshAccessToken()
      .then(accessToken => {
        setLocalStorageItem('accessToken', accessToken.accessToken)
        setToken(accessToken)
      })
      .catch(handleError)
  }

  function verifyAccessToken() {
    return Line.verifyAccessToken()
      .then(result => Alert.alert(result.clientId, result.expiresIn.toString()))
      .catch(handleError)
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    )
  }

  return (
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
  )
}

const strings = {
  accessToken: 'Access Token',
  errorMessage: 'Failed to get information',
  errorTitle: 'Error',
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
