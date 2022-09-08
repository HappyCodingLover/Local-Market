import { StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    height: Dimensions.get('window').height * 0.9,
  },
  contentPage: {
    bottom: 50,
  },
  contentActionBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  img: {
    width: Utils.scaleWithPixel(Dimensions.get('window').width - 60),
    height: Utils.scaleWithPixel(200),
    borderRadius: Utils.scaleWithPixel(50) / 2,
  },
  slide: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  titleSlide: {
    marginTop: 30,
  },
  textSlide: {
    marginTop: 30,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  skipBtn: {
    color: 'red',
  },
  bottomContainer: {
    flex: 5,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginTop: 100,
  },
  saveBtn: {
    marginBottom: 25,
    height: 40,
    // width: Dimensions.get('window').width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
