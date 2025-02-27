import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ScreenStack from './ScreenStack';
import MainStack from './MainStack';

const Stack = createNativeStackNavigator();

const isLogin = false;

export default function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator>{isLogin ? MainStack() : ScreenStack()}</Stack.Navigator>
    </NavigationContainer>
  );
}
