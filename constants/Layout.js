import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const header = 57;
const widthScreen = Dimensions.get('screen').width;
const heightScreen = Dimensions.get('screen').height;

export default {
  window: {
    width,
    height,
  },
  screen: {
    width: widthScreen,
    height: heightScreen,
  },
  header,
  isSmallDevice: width < 375,
};
