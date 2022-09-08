import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    zIndex: 100,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: BaseColor.whiteColor,
    margin: 4,
    padding: 10,
    borderRadius: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  buttonCaption: { paddingTop: 6 },
  typeImg: {
    width: 20,
    height: 20,
  },
});
