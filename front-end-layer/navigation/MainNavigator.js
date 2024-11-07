/**
 * @file MainNavigator.js  
 * @description Includes main navigations of the pages. 
 * 
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screen Links
import WelcomePage from '../screens/WelcomePage';
import SignUpPage from '../screens/SignUpPage';
import LoginPage from '../screens/LoginPage';
import SettingsPage from '../screens/SettingsPage';
import BottomTabsNavigator from './BottomTabsNavigator';

const Stack = createStackNavigator();

// Main Stack navigations
const MainNavigator = () => (
    <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={BottomTabsNavigator} />
        <Stack.Screen name="Settings" component={SettingsPage} />
    </Stack.Navigator>
);

export default MainNavigator;
