/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import type {PropsWithChildren} from 'react';
import LoginPage from './src/screens/LoginPage';
import {View} from 'react-native';
import Route from './src/navigations/Route';
import {Provider} from 'react-redux';
import store from './src/redux/store';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        <Route />
      </View>
    </Provider>
    // <NavigationContainer>
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     {/* <Stack.Screen name="Home" component={HomePage}></Stack.Screen> */}
    //     <Stack.Screen name="Login" component={LoginPage}></Stack.Screen>
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default App;
