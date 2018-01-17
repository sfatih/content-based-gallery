/*jshint esversion: 6 */ 
import React from 'react';
import { Text, View,  } from 'react-native';
import {TabNavigator} from 'react-navigation';

import listScreen from './tabs/listScreen';
import cameraScreen from './tabs/cameraScreen';
import searchScreen from './tabs/searchScreen';

const MainScreenNavigator = TabNavigator({
    Search: { screen: searchScreen },
    Camera: { screen: cameraScreen }
},{
    swipeEnabled:true,
    tabBarOptions:{
        activeTintColor:'#fff',
        activeBackgroundColor:'#fff',
        inactiveTintColor:'#2F353B',
        inactiveBackgroundColor:'#44B6AE'        
    }
});

export default MainScreenNavigator;