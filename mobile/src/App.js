/**
 * Creative Workspace Mobile App
 * React Native + Redux + Firebase
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './redux/store';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  useEffect(() => {
    // TODO: Initialize Firebase
    // TODO: Check authentication state
    // TODO: Initialize Stripe
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
