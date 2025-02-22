import {ImageBackground, StyleSheet, View} from 'react-native'
import React from 'react'
import { height, width } from '../styles/responsiveSize'
import imagePath from '../utils/constants/imagePath'

export const AddNotePage = () => {
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={styles.imgBackStyle}
        source={imagePath.backIc}
      >

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  imgBackStyle: {
    width: width/1,
    height: height/2
  }
})