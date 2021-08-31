import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import WelcomeScreen from './screens/welcome';
import { AppTabNavigator } from './components/bottomTabNavigator.js';
import { AppStackNavigator } from './components/appStackNavigator.js';
import SignUp from './screens/signup';
export default function App() {
  return <AppContainer />;
} 

const switchNavigator = createSwitchNavigator({
  FirstScreen: { screen: WelcomeScreen },
  Signup: { screen: SignUp },
  Tabs: { screen: AppStackNavigator },
});

const AppContainer = createAppContainer(switchNavigator);
