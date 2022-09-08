import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: { marginHorizontal: 20 },
  flexDirectionRow: { flexDirection: 'row', alignItems: 'center' },
  contentImg: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginVertical: 10,
  },
  articleImg: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginVertical: 10,
  },
  dotList: { fontSize: 20, marginRight: 5 },
  numberList: { marginRight: 5 },
  list: { marginVertical: 10 },
  viewSpace: { marginVertical: 10 },
  textSpace: { marginBottom: 10 },
  text: { textAlign: 'center', paddingBottom: 20 },
});
