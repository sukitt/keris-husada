import React, { useContext } from 'react';
import { Icon, Button } from '@ui-kitten/components';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import CustomDrawContentComponent from '../components/CustomDrawContentComponent';
import MainTabNavigator from './MainTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import EditScreen from '../screens/EditScreen';
import VerificationScreen from '../screens/VerificationScreen';
import KhsScreen from '../screens/KhsScreen';
import JadwalScreen from '../screens/JadwalScreen';
import EditScreenCustom from '../screens/EditScreenCustom';
import NilaiScreen from '../screens/NilaiScreen';
import HomeScreen from '../screens/HomeScreen';

const HomeStack = createStackNavigator({
    Main: {
        screen: HomeScreen,
    }
})

const ProfileStack = createStackNavigator(
    {
        Main: {
            screen: ProfileScreen,
            navigationOptions: ({ navigation }) => ({
             header: null,
            }),
            path: 'profile/:label',
        },
        Edit: {
            screen: EditScreenCustom,
        },
        Verify: {
            screen: VerificationScreen,
        },
    },
);

const KhsStack = createStackNavigator({
    Main: {
        screen: KhsScreen,
    }
})

const JadwalStack = createStackNavigator({
    Main: {
        screen: JadwalScreen,
    }
})

const NilaiStack = createStackNavigator({
    Main: {
        screen: NilaiScreen,
    }
})

const size   = 27

const drawerNavigator = createDrawerNavigator({
    Profile: {
        screen: ProfileStack,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'Profile',
            drawerIcon: ({ tintColor }) => (
                <Icon name='person-outline' width={size} height={size} fill={tintColor} />
            )
        })
    },
    KHS: {
        screen: KhsStack,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'KHS',
            drawerIcon: ({ tintColor }) => (
                <Icon name='book-outline' width={size} height={size} fill={tintColor} />
            )  
        })
    },
    Jadwal: {
        screen: JadwalStack,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'Jadwal Kuliah',
            drawerIcon: ({ tintColor }) => (
                <Icon name='calendar-outline' width={size} height={size} fill={tintColor} />
            )
        })
    },
    Nilai: {
        screen: NilaiStack,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'Nilai',
            drawerIcon: ({ tintColor }) => (
                <Icon name='book-outline' width={size} height={size} fill={tintColor} />
            ) 
        })
    },
    Portal: {
        screen: HomeStack,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'Portal',
            drawerIcon: ({ tintColor }) => (
                <Icon name='hash-outline' width={size} height={size} fill={tintColor} />
            )
        })
    },
},{
    initialRouteName: 'Portal',
    // statusBarAnimation: 'fade',
    // hideStatusBar: true,
    contentComponent: CustomDrawContentComponent,

});

export default drawerNavigator;