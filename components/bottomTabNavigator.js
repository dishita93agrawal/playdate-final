import * as React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from '../screens/home';
import MyUpcomingEvents from '../screens/myEvents';
import NotificationScreen from '../screens/notifications';
import Settings from '../screens/update';
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
import CreateEvent from '../screens/createEvent';
import { LinearGradient } from 'expo-linear-gradient';
import PreProfile from '../screens/pre-profile';

const CustomButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        top: -20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}>
      <LinearGradient
        colors={['#FC3973', '#FF7455']}
        style={{ width: 55, height: 55, borderRadius: 35 }}>
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const AppTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <View>
          <AntDesign name="home" size={25} color={tintColor} />
        </View>
      ),
      tabBarOptions: { activeTintColor: '#FC3973', inactiveTintColor: 'gray' },
      tabBarLabel: '',
    },
  },
  Notifications: {
    screen: NotificationScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <View>
          <MaterialIcons name="notifications" size={24} color={tintColor} />
        </View>
      ),
      tabBarOptions: { activeTintColor: '#FC3973', inactiveTintColor: 'gray' },
      tabBarLabel: '',
    },
  },
  AddTask: {
    screen: CreateEvent,
    navigationOptions: {
      tabBarLabel: () => {
        return null;
      },
      tabBarIcon: ({ tintColor }) => (
        <View>
          <AntDesign name="plus" size={24} color="white" />
        </View>
      ),
      tabBarOptions: {
        activeTintColor: 'white',
        inactiveTintColor: 'grey',
      },
      tabBarButtonComponent: (props) => {
        return <CustomButton {...props} />;
      },
    },
  },
  UpcomingEvents: {
    screen: MyUpcomingEvents,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <View>
          <AntDesign name="calendar" size={25} color={tintColor} />
        </View>
      ),
      tabBarOptions: { activeTintColor: '#FC3973', inactiveTintColor: 'gray' },
      tabBarLabel: '',
    },
  },
  Profile: {
    screen: PreProfile,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Feather name="user" size={24} color={tintColor} />
        </View>
      ),
      tabBarOptions: { activeTintColor: '#FC3973', inactiveTintColor: 'gray' },
      tabBarLabel: '',
    },
  },
});
