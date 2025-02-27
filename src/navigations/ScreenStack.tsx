import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { AddNotePage } from '../screens/AddNotePage';
import LoginPage from '../screens/LoginPage';
import SignUpPage from '../screens/SignUpPage';
import navigationScreenNames from '../utils/constants/navigationScreenNames';
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

const Stack = createNativeStackNavigator();
const isAuth: boolean = false;

export default function ScreenStack() {
  const [loading, setLoading] = useState(false);

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    if(!('email' in credentials)) return;
    setLoading(true);
    const {email, password} = credentials;
    const {error, data} = await supabase.auth.signUp({email, password});
    if(error) {
      Alert.alert(error.message);
    }

    console.log(data);
    setLoading(false);
  }

  const login = async (credentials: SignInWithPasswordCredentials) => {
    if(!('email' in credentials)) return;
    setLoading(true);
    const {email, password} = credentials;
    const {error, data} = await supabase.auth.signInWithPassword({email, password});
    if(error) {
      Alert.alert(error.message);
    }

    console.log(data);
    setLoading(false);
  }


  return (
    <>
    <Stack.Screen options={{headerShown: false}} name={navigationScreenNames.HOME} component={isAuth ? AddNotePage: LoginPage} initialParams={{ onLogin: login, loading: false}}></Stack.Screen>
    <Stack.Screen options={{headerShown: false}} name={navigationScreenNames.LOGIN} component={LoginPage} initialParams={{ onLogin: login, loading: false}}></Stack.Screen>
    <Stack.Screen options={{headerShown: false}} name={navigationScreenNames.SIGNUP} component={SignUpPage} initialParams={{onSignUp: signUp, loading: false}}></Stack.Screen>
    </>
  )
}