import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { User } from '../interfaces/User';

const Stack = createNativeStackNavigator();

export default function Route() {



  return (
    <NavigationContainer>
      <Stack.Navigator>
        {AuthStack()}
      </Stack.Navigator>
    </NavigationContainer>
  )
}