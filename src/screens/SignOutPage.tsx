import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {supabase} from '../lib/supabase';
import colors from '../styles/colors';
import {useDispatch} from 'react-redux';
import {logoutReducer} from '../redux/reducers/userAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignOutPage = () => {
  
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      const {error} = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        dispatch(logoutReducer());
        await AsyncStorage.removeItem('supabase.auth.token');
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
