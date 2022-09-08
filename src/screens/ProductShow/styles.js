import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    // flex: 1,
    borderRadius: 10,
  },
  carouselPagination: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  swiperImg: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width / 2,
    borderRadius: 10,
  },
  bottomBar: {
    paddingVertical: 5,
    // paddingHorizontal: 20,
    height: 50,
    backgroundColor: BaseColor.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPrice: {
    flex: 1,
    // alignItems: 'center',
    padding: 5,
    marginHorizontal: 5,
  },
  countBtn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: BaseColor.grayBackgroundColor,
    borderRadius: 5,
  },
  countBtnInside: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  addBtn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 8,
  },
  partnerDateBadge: {
    backgroundColor: BaseColor.textPrimaryColor,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  partnerDescriptionBadge: {
    marginLeft: 6,
    backgroundColor: BaseColor.textPrimaryColor,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  partnerImgBackground: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width / 2,
    borderRadius: 10,
  },
});
