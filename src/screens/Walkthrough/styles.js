import { StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    height: Dimensions.get('window').height * 0.9,
  },
  contentPage: {
    bottom: 40,
  },
  contentActionBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  img: {
    width: Utils.scaleWithPixel(Dimensions.get('window').width - 80),
    height: Utils.scaleWithPixel(200),
    borderRadius: Utils.scaleWithPixel(50) / 2,
  },
  dotStyle: {
    backgroundColor: '#B1B1B1',
  },
  slide: {
    flex: 1,
  },
  title: { marginTop: 15, textAlign: 'center' },
  text: { marginTop: 15, textAlign: 'center' },
  titleView: { flex: 1, marginBottom: 40 },
  titleSlide: {
    textAlign: 'center',
    marginBottom: 20,
  },
  textSlide: {
    marginBottom: 20,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  skipView: { flex: 1, alignItems: 'center' },
  skipBtn: {
    color: 'red',
  },
  flex1: { flex: 1 },
  titleView1: { flex: 3, marginTop: 30 },
  titleView2: { flex: 2, justifyContent: 'center' },
  carouselPagination: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    // backgroundColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
