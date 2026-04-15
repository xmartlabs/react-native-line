import { Platform } from 'react-native'

export const isAndroidPlatform = Platform.OS === 'android'

export const isiOSPlatform = Platform.OS === 'ios'

export const isWebPlatform = Platform.OS === 'web'
