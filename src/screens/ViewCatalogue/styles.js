import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
  },
  mainContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  bottomContainer: {
    flex: 2,
    // justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 30,
  },
  text: { textAlign: 'center', paddingBottom: 30 },
  addBtn: {
    height: 40,
    width: Dimensions.get('window').width * 3 / 5,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: BaseColor.redColor,
    borderRadius: 5,
    marginHorizontal: 67,
    marginTop: 50,
  },
  btnCaption: {
    color: BaseColor.whiteColor,
    padding: 11,
  },
  saveBtn: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    marginHorizontal: 45,
    height: 40,
    width: Dimensions.get('window').width * 3 / 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
