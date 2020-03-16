import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import MainDrawNavigator from './MainDrawNavigator';

const AuthStack = createStackNavigator({ 
  Login: {
    screen: LoginScreen,
    navigationOptions: ({}) => ({
      header: null,
    })
  }
})

export default createAppContainer(
  createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: MainDrawNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  })
);
