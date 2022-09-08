import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    marginHorizontal: 20,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
  },
  order: {
    backgroundColor: BaseColor.whiteColor,
    borderRadius: 10,
    marginVertical: 4,
  },
  orderItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderImageInfo: { flex: 7, flexDirection: 'row' },
  orderItemImg: { width: 64, height: 64, borderRadius: 5 },
  orderInfo: { marginLeft: 10 },
  orderItemStatusPrice: {
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  orderItemStatus: {
    paddingTop: 7,
    paddingRight: 0,
  },
  orderItemPrice: { textAlign: 'right' },
  orderDetailsView: { flexDirection: 'row', justifyContent: 'space-between' },
  orderDetails: {
    backgroundColor: BaseColor.grayBackgroundColor,
    margin: 8,
    borderRadius: 5,
    padding: 10,
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
  partnerImgBackground: {
    width: 64,
    height: 64,
  },
});
