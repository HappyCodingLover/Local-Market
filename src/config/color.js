/**
 * Color Palette Define
 */

let OrangeColor = {
  primaryColor: '#E5634D',
  darkPrimaryColor: '#C31C0D',
  lightPrimaryColor: '#FF8A65',
  accentColor: '#4A90A4',
};

let BlueColor = {
  primaryColor: '#5DADE2',
  darkPrimaryColor: '#1281ac',
  lightPrimaryColor: '#68c9ef',
  accentColor: '#FF8A65',
};

let PinkColor = {
  primaryColor: '#A569BD',
  darkPrimaryColor: '#C2185B',
  lightPrimaryColor: '#F8BBD0',
  accentColor: '#8BC34A',
};

let GreenColor = {
  primaryColor: '#58D68D',
  darkPrimaryColor: '#388E3C',
  lightPrimaryColor: '#C8E6C9',
  accentColor: '#607D8B',
};

let YellowColor = {
  primaryColor: '#FDC60A',
  darkPrimaryColor: '#FFA000',
  lightPrimaryColor: '#FFECB3',
  accentColor: '#795548',
};

let FlegigsColor = {
  primaryColor: '#60C3FF',
  darkPrimaryColor: '#5887F9',
  lightPrimaryColor: '#BCC5D3',
  accentColor: '#FC5F6B',
};

/**
 * Main color use for whole application
 */
let BaseColor = {
  ...FlegigsColor,
  ...{
    whiteHeaderColor: '#FFFFFF',
    textPrimaryColor: '#262626',
    textSecondaryColor: '#E0E0E1',
    grayColor: '#5D5D5D',
    lightGrayColor: '#585858',
    lighterGrayColor: '#58585831',
    drawerTintColor: '#F3F3F3',
    dividerColor: '#BDBDBD',
    whiteColor: '#FFFFFF',
    fieldColor: '#F5F5F5',
    yellowColor: '#FDC60A',
    darkGrayColor: '#5c5c5b',
    transparentColor: '#FFFFFFFF',
    headerIconColor: '#9B9B9B',
    blackColor: '#000000',
    headerColor: '#FFFFFF',
    shadowColor: '#4c4c4b',
    redColor: '#FF2D34',
    textInputBackgroundColor: '#F1F1F1',
    placeholderColor: '#B3B3B3',
    grayBackgroundColor: '#F4F4F4',
    chatboxBackgroundColor: '#F6F6F6',
    blueBackgroundColor: '#1834B7',
    successColor: '#65E487',
    cancelColor: '#B5B5B5',
    processingColor: '#FFC11E',
    flowerColor: '#FFF7D6',
    vegetableColor: '#FFE7D6',
    fruitsColor: '#D8FFD6',
    meatColor: '#D6E5FF',
    sweatsColor: '#F4D6FF',
  },
};

export {
  BaseColor,
  OrangeColor,
  BlueColor,
  PinkColor,
  GreenColor,
  YellowColor,
};
