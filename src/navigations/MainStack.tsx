import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import navigationScreenNames from '../utils/constants/navigationScreenNames';
import { AddNotePage } from '../screens/AddNotePage';
import ScreenStack from './ScreenStack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();


const MainStack = () => {
  return (
    <>
    <Stack.Screen options={{headerShown: false}} name={navigationScreenNames.HOME} component={ AddNotePage }></Stack.Screen>
    </>
  )
}

export default MainStack

const styles = StyleSheet.create({})