import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColor.whiteColor,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  loadingContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height - 150,
    left: 0,
    right: 0,
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginTop: 20,
  },
  logoView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
