import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { logoutReducer } from '../redux/reducers/userAuth';
import colors from '../styles/colors';

const SignOutPage = () => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      // 🔹 First, clear Redux state immediately
      dispatch(logoutReducer());

      // 🔹 Then, clear AsyncStorage
      await AsyncStorage.removeItem('supabase.auth.token');

      // 🔹 Now, sign out from Supabase (async)
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        console.log('User signed out successfully');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon name="logout" size={24} color={colors.red} />
      </TouchableOpacity>
    </View>
  );
};

export default SignOutPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 8,
  },
});
