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
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 0.8,
    alignItems: 'center',
    marginTop: 10,
  },
  centerContainer: {
    flex: 1,
  },
  bottomContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  logoView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    marginTop: 11,
    marginBottom: 10,
    color: BaseColor.textPrimaryColor,
    fontSize: 16,
  },
  phoneWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
    // marginHorizontal: 67,
    width: 250,
    borderRadius: 5,
    height: 44,
  },
  nextBtn: {
    marginTop: 20,
    height: 44,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  callingCode: { fontSize: 16, marginRight: 4, marginLeft: 10 },
  typePhoneNumberText: { paddingBottom: 7, textAlign: 'center' },
  termsText: {
    paddingTop: 20,
    lineHeight: 20,
    textAlign: 'center',
    marginHorizontal: 30,
    color: BaseColor.lighterGrayColor,
  },
  background: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
