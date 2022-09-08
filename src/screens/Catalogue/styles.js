import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: BaseColor.grayBackgroundColor,
  },
  article: {
    borderWidth: 1,
    borderColor: '#F4F4F4',
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 10,
    marginRight: 15,
  },
  articlePlaceholder: {
    padding: 2,
    borderRadius: 5,
    marginRight: 5,
  },
  articleImg: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  articleImgPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 5,
  },
  type: {
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 5,
    // width: 120,
    paddingVertical: 5,
    paddingRight: 10,
  },
  typeView: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  typeImg: {
    width: 20,
    height: 20,
  },
  articleImgBackground: {
    width: 90,
    height: 90
  },
  partnerView: { marginLeft: 20, marginTop: 5, flex: 1 },
  partnerDateBadge: {
    zIndex: 100,
    position: 'absolute',
    left: 12,
    top: 176,
    backgroundColor: BaseColor.textPrimaryColor,
    padding: 7,
    borderRadius: 5,
  },
  partnerDescriptionBadge: {
    zIndex: 100,
    position: 'absolute',
    left: 100,
    top: 176,
    backgroundColor: BaseColor.textPrimaryColor,
    padding: 7,
    borderRadius: 5,
  },
  partnerImg: {
    width: Dimensions.get('window').width - 40,
    height: 190,
    borderRadius: 10,
    marginRight: 15,
    marginTop: 5,
  },
  bottomBar: {
    backgroundColor: BaseColor.whiteColor,
  },
  typesViewPlaceholder: {
    borderRadius: 5,
    marginRight: 5,
    width: 120,
  },
  cart: {
    paddingTop: 10,
    zIndex: 2,
    height: 64,
    paddingVertical: 10,
    backgroundColor: BaseColor.whiteColor,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalPrice: {
    flex: 1,
    // alignItems: 'center',
    padding: 5,
    marginHorizontal: 5,
  },
});
