/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import Route from './src/navigations/Route';
import { store } from './src/redux/store';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        <Route />
      </View>
    </Provider>
  );
}

export default App;
