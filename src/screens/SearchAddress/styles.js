import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: { marginHorizontal: 20, marginVertical: 10 },
  inputContainer: {
    borderRadius: 5,
    height: 44,
    paddingVertical: 14,
    paddingHorizontal: 11,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    marginRight: 9,
  },
  input: {
    fontSize: 16,
    marginRight: 20,
  },
  nextBtn: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 5,
    height: 54,
    width: Dimensions.get('window').width * 4 / 5,
    padding: 5,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColor.redColor,
  },
  list: {
    marginVertical: 4,
    paddingLeft: 10,
  }
});
