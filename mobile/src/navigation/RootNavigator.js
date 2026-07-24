/**
 * Root Navigation Stack
 * Handles Auth and Main App navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// TODO: Import screens
// import AuthScreen from '../screens/AuthScreen';
// import MainTabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  // TODO: Get auth state from Redux
  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {false ? (
        // Authenticated screens
        <Stack.Screen
          name="Main"
          // component={MainTabNavigator}
          options={{ animationEnabled: false }}
        />
      ) : (
        // Auth screens
        <Stack.Screen
          name="Auth"
          // component={AuthScreen}
          options={{ animationEnabled: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
