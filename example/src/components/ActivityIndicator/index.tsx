import React from 'react'
import {
  ActivityIndicator as _ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  View,
} from 'react-native'

export const ActivityIndicator = (props: ActivityIndicatorProps) => (
  <View style={styles.container}>
    <_ActivityIndicator {...props} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
