import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, StyleProp, TextStyle, DimensionValue } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'
import { moderateScale, width } from '../../styles/responsiveSize'

interface ITextInputProps {
  placeholder?: string,
  onChangeText?: (text: string) => void,
  value?: string,
  secureTextEntry?: boolean,
  keyboardType?: KeyboardTypeOptions,
  marginBottom?: DimensionValue
}

export default function TextInputComponent(props: ITextInputProps) {
  return (
    <View>
      <TextInput
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        style={{...styles.inputStyle,marginBottom: props.marginBottom}}
        value={props.value}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputStyle: {
    marginBottom: moderateScale(30),
    backgroundColor: colors.themebackgroundcolor,
    width: width / 1.1,
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: colors.black
  }
})