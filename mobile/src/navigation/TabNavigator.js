/**
 * Main Tab Navigator
 * Bottom tab navigation for app features
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// TODO: Import screens
// import ProofingScreen from '../screens/ProofingScreen';
// import InvoicingScreen from '../screens/InvoicingScreen';
// import AssetsScreen from '../screens/AssetsScreen';
// import ProjectsScreen from '../screens/ProjectsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Projects') {
            iconName = focused ? 'folder-open' : 'folder';
          } else if (route.name === 'Proofing') {
            iconName = focused ? 'image' : 'image';
          } else if (route.name === 'Invoices') {
            iconName = focused ? 'receipt' : 'receipt';
          } else if (route.name === 'Assets') {
            iconName = focused ? 'collections' : 'collections';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      {/* TODO: Add screen components */}
      {/* 
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ title: 'Projects' }}
      />
      <Tab.Screen
        name="Proofing"
        component={ProofingScreen}
        options={{ title: 'Proofing' }}
      />
      <Tab.Screen
        name="Invoices"
        component={InvoicingScreen}
        options={{ title: 'Invoices' }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        options={{ title: 'Assets' }}
      />
      */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
