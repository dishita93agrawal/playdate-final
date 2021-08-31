import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './bottomTabNavigator';
import CustomMenu from './customMenu';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {screen: AppTabNavigator}
},{
    contentComponent: CustomMenu
},{
    initialRouteName: 'Home'
}
)