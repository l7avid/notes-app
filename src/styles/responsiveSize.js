/* eslint-disable prettier/prettier */
import {Dimensions, Platform, StatusBar} from 'react-native';
const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 375;

const sliderWidth = width - 20;
const itemWidth = width - 20;

const scale = (size) => (width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
const textScale = (percent) => {
  const screenHeight = Dimensions.get('window').height;
  const ratio =
    Dimensions.get('window').height / Dimensions.get('window').width;
  const deviceHeight = 375
    ? screenHeight * (ratio > 1.8 ? 0.14 : 0.15)
    : Platform.OS === 'android'
    ? screenHeight - StatusBar.currentHeight
    : screenHeight;

  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
};

export {
  scale,
  moderateScale,
  textScale,
  width,
  height,
  sliderWidth,
  itemWidth,
};
