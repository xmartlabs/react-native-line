import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  apiItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    borderBottomColor: 'gray',
    padding: 10,
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 12,
    color: 'gray',
  },
})
