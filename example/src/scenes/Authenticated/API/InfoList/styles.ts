import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  centering: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  itemTitle: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  itemValue: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'gray',
  },
})
