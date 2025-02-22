import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import navigationScreenNames from '../utils/constants/navigationScreenNames';
import LoginPage from '../screens/LoginPage';
import SignUpPage from '../screens/SignUpPage';
import { AddNotePage } from '../screens/AddNotePage';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <>
    <Stack.Screen options={{headerShown: false}} name={navigationScreenNames.HOME} component={AddNotePage}></Stack.Screen>
    <Stack.Screen options={{headerShown: false}} name={navigationScreenNames.LOGIN} component={LoginPage}></Stack.Screen>
    <Stack.Screen options={{headerShown: false}} name={navigationScreenNames.SIGNUP} component={SignUpPage}></Stack.Screen>
    </>
  )
}