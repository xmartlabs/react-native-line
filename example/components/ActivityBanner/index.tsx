import { FunctionComponent } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'

import { Color } from '@/constants/color'

interface Props {
  backgroundColor?: Color
}

export const ActivityBanner: FunctionComponent<Props> = ({
  backgroundColor = Color.Black50PCT,
}) => (
  <Animated.View
    entering={FadeIn}
    exiting={FadeOut}
    style={[styles.container, { backgroundColor }]}>
    <Animated.View
      entering={ZoomIn}
      exiting={ZoomOut}
      style={styles.contentContainer}>
      <ActivityIndicator size="small" />
    </Animated.View>
  </Animated.View>
)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: Color.White,
    borderRadius: 12,
    padding: 12,
  },
})
