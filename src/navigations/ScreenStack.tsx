import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { loginReducer } from '../redux/reducers/userAuth';
import { HomePage } from '../screens/HomePage';
import LoginPage from '../screens/LoginPage';
import SignUpPage from '../screens/SignUpPage';
import navigationScreenNames from '../utils/constants/navigationScreenNames';

const Stack = createNativeStackNavigator();

export default function ScreenStack() {
  const dispatch = useDispatch();
  const [_loading, setLoading] = useState(false);

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const {email, password, options} = credentials;
    const {error, data} = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    if (error) {
      Alert.alert(error.message);
    }
    console.log(data);
    setLoading(false);
  };

  const login = async (credentials: SignInWithPasswordCredentials) => {
    if (!('email' in credentials)) return;
    setLoading(true);
    const {email, password} = credentials;
    const {error, data} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    } else {
      dispatch(loginReducer(data.user));
    }
    console.log(data);
    setLoading(false);
  };

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationScreenNames.HOME} component={HomePage} />
      <Stack.Screen
        name={navigationScreenNames.LOGIN}
        component={LoginPage}
        initialParams={{onLogin: login, loading: false}}
      />
      <Stack.Screen
        name={navigationScreenNames.SIGNUP}
        component={SignUpPage}
        initialParams={{onSignUp: signUp, loading: false}}
      />
    </Stack.Navigator>
  );
}
