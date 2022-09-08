import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    height: 55,
    flexDirection: 'row',
    // backgroundColor: BaseColor.headerColor,
    // backgroundColor: 'red',
  },
  contentLeft: {
    flex: 2,
    justifyContent: 'center',
    marginLeft: 4,
    width: 60,
  },
  contentCenter: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    height: '100%',
  },
  contentRightSecond: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 0,
    height: '100%',
  },
  right: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
