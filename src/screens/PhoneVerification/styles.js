import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
  },
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: { paddingLeft: 20, width: 60 },
  headerCenter: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1.3,
  },
  containHeader: {
    height: 55,
    flexDirection: 'row',
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 67,
    padding: 10,
    width: '100%',
  },
  logoView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    padding: 0,
    marginLeft: 10,
    color: BaseColor.textPrimaryColor,
    fontSize: 14,
    textAlign: 'center',
  },
  nextButton: {
    width: '50%',
    height: 70,
    borderRadius: 40,
  },
  codeWrapper: {
    flexDirection: 'row',
    marginTop: 7,
    height: 44,
    width: 280,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    backgroundColor: BaseColor.textInputBackgroundColor,
  },
  callingCode: { fontSize: 14 },
  typePhoneNumberText: { textAlign: 'center' },
  termsText: { paddingTop: 20, lineHeight: 20, textAlign: 'center' },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
  },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 16,
    height: 40,
    lineHeight: 38,
    fontSize: 16,
    textAlign: 'center',
  },

  cell2: {
    width: 16,
    height: 40,
    lineHeight: 38,
    fontSize: 16,
    textAlign: 'center',
    color: BaseColor.lighterGrayColor,
  },

  focusCell: {
    borderColor: '#000',
  },
});
