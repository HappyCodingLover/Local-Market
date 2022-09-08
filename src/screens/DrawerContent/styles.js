import { BaseColor } from '@config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    backgroundColor: BaseColor.whiteColor,
    marginLeft: 20,
  },
  drawerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 30,
  },
  drawerHeaderContent: {
    marginLeft: 12,
  },
  drawerHeaderText: {
    color: BaseColor.blackColor,
    fontSize: 20,
  },
  icon: {
    width: 30,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: BaseColor.chatboxBackgroundColor,
  },
});
