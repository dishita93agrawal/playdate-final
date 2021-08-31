import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { AppTabNavigator } from './bottomTabNavigator';
import ExploreEventDetails from '../screens/ExploreEventDetails';
import UpcomingEventDetails from '../screens/UpcomingEventDetails';
import MyUpcomingEvents from '../screens/myEvents';
import NotificationScreen from '../screens/notifications';
import SignUp from '../screens/signup';
import Welcome from '../screens/welcome';
import Settings from '../screens/update';
import MyHeader from './header';
import CreateEvent from '../screens/createEvent';

export const AppStackNavigator = createStackNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: { headerShown: false },
    },
    ExploreEventDetails: {
      screen: ExploreEventDetails,
      navigationOptions: { headerShown: false },
    },
    UpcomingEventDetails: {
      screen: UpcomingEventDetails,
      navigationOptions: { headerShown: false },
    },
    SignUp: { screen: SignUp, navigationOptions: { headerShown: false } },
    Settings: { screen: Settings, navigationOptions: { headerShown: false } },
    Welcome: { screen: Welcome, navigationOptions: { headerShown: false } },
  },
  {
    initialRouteName: 'Home',
  }
);
