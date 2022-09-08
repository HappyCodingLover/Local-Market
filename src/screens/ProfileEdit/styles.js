import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
  },
  mainContainer: {
    flex: 4,
    paddingTop: 20,
    marginHorizontal: 20,
  },
  nextButton: {
    marginTop: 50,
    marginBottom: 25,
    width: '50%',
    height: 70,
    borderRadius: 40,
    alignSelf: 'center',
  },
  textInput: {
    color: BaseColor.textPrimaryColor,
    backgroundColor: BaseColor.textInputBackgroundColor,
    padding: 15,
    borderRadius: 5,
    marginTop: 7,
    marginBottom: 20,
    fontSize: 16,
    height: 46,
  },
  textInput1: {
    height: 44,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
  },
  phoneWrapper: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    backgroundColor: BaseColor.textInputBackgroundColor,
    marginHorizontal: 0,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 10,
    color: BaseColor.textPrimaryColor,
    fontSize: 14,
  },
  saveBtn: {
    marginBottom: 25,
    height: 40,
    // width: Dimensions.get('window').width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
  },
  innerText: {
    marginHorizontal: 15,
    marginVertical: 13,
  },
});
