/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import colors from '../../../../styles/colors';
import {
  moderateScale,
  textScale,
  width,
} from '../../../../styles/responsiveSize';

interface ButtonProps {
  testID?: string;
  btnText: string;
  btnStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onPress?: () => void;
}

export default function Button({
  testID,
  btnText,
  btnStyle,
  textStyle,
  onPress,
  disabled,
}: ButtonProps) {
  console.log({disabled});

  const combinedStyle = [
    styles.btnStyle,
    disabled && styles.btnDisabled,
    btnStyle,
  ];

  const combinedTextStyle = [
    styles.bntTextStyle,
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={combinedStyle}
      testID={testID}
      disabled={!!disabled}>
      <Text style={combinedTextStyle}>{btnText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: colors.btnColor,
    paddingVertical: moderateScale(12),
    width: width / 1.7,
    alignItems: 'center',
    height: moderateScale(44),
  },
  btnDisabled: {
    backgroundColor: '#cccccc',
  },
  bntTextStyle: {
    fontSize: textScale(14),
    color: colors.white,
    lineHeight: textScale(14),
  },
  textDisabled: {
    color: '#666666',
  },
});