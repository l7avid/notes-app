import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'
import { moderateScale, textScale, width } from '../../styles/responsiveSize'

interface ButtonProps {
  btnText: string;
  btnStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export default function Button({ btnText, btnStyle, textStyle, onPress }: ButtonProps) {

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btnStyle, btnStyle]}>
      <Text style={[styles.bntTextStyle, textStyle]}>{btnText}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: colors.btnColor,
    paddingVertical: moderateScale(12),
    width: width / 1.7,
    alignItems: 'center',
    height: moderateScale(44)
  },
  bntTextStyle: {
    fontSize: textScale(14),
    color: colors.white
  }
})