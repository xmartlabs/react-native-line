import Line, { UserProfile } from '@xmartlabs/react-native-line'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
} from 'react-native'

import { removeLocalStorageItem } from '@/common/localStorage'
import { PressableOpacity } from '@/components/PressableOpacity'
import { ThemedView } from '@/components/ThemedView'

export default function () {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<UserProfile>()

  useEffect(() => {
    setLoading(true)
    Line.getProfile()
      .then(setUser)
      .catch(() => Alert.alert(strings.errorTitle, strings.errorMessage))
      .finally(() => setLoading(false))
  }, [])

  function logOut() {
    return Line.logout().then(() => {
      removeLocalStorageItem('accessToken')
      router.replace('/login')
    })
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
      <ThemedView style={styles.container}>
        <Image source={{ uri: user?.pictureURL }} style={styles.image} />
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.id}>({user?.userID})</Text>
      </ThemedView>
      <PressableOpacity onPress={logOut} style={styles.logOutContainer}>
        <Text style={styles.logOut}>{strings.logOut}</Text>
      </PressableOpacity>
    </ThemedView>
  )
}

const strings = {
  errorMessage: 'Failed to get profile',
  errorTitle: 'Error',
  logOut: 'Logout',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 16,
  },
  id: {
    color: 'black',
    fontSize: 10,
  },
  image: {
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: Dimensions.get('window').width / 1.5,
    borderWidth: 0.5,
    height: Dimensions.get('window').width / 3,
    resizeMode: 'cover',
    width: Dimensions.get('window').width / 3,
  },
  logOut: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
  },
  logOutContainer: {
    paddingVertical: 32,
  },
  name: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
