import { StyleSheet } from 'react-native'
import { Color } from 'src/styles/Color'

export const typography = StyleSheet.create({
  h1: {
    color: Color.PrimaryGreen,
    fontSize: 65,
    fontWeight: 'normal',
    textAlign: 'center',
    width: 245,
  },
  h2: {
    color: Color.PrimaryGrey,
    fontFamily: 'Helvetica',
    fontSize: 14,
    height: 17,
    textAlign: 'center',
    width: 162,
  },
  h3: {
    color: Color.White,
    fontSize: 16,
    lineHeight: 28,
  },
})
