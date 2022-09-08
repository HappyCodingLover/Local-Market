import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {
    flex: 1,
  },
  bottomBar: {
    zIndex: 2,
    height: 64,
    paddingVertical: 5,
    backgroundColor: BaseColor.whiteColor,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalPrice: {
    flex: 1,
    // alignItems: 'center',
    // padding: 5,
    marginLeft: 10,
  },
  outOfStockLabel: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    width: 130,
    height: 40,
  },
  countBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: BaseColor.grayBackgroundColor,
    borderRadius: 5,
    width: 130,
    height: 35,
  },
  countBtnInside: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  nextBtn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: BaseColor.redColor,
    borderRadius: 5,
    paddingVertical: 5,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 5,
    padding: 5,
  },
  productImg: {
    width: '100%',
    height: (Dimensions.get('window').width - 40) / 5,
    borderRadius: 5,
  },
  productInfo: {
    flex: 3,
    flexDirection: 'row',
    marginLeft: 5,
    justifyContent: 'space-between',
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  minimalWarning: {
    position: 'absolute',
    bottom: 65,
    backgroundColor: BaseColor.textPrimaryColor,
    padding: 5,
    height: 30,
    width: '100%',
  },
  minimalCheckoutText: { textAlign: 'center', color: 'white' },
  cart: {
    zIndex: 2,
    height: 64,
    // paddingVertical: 5,
    backgroundColor: BaseColor.whiteColor,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  partnerImgBackground: {
    width: '100%',
    height: (Dimensions.get('window').width - 40) / 5,
    borderRadius: 5,
  },
});
