/**
 * @file MainNavigator.js
 * @description Includes main navigations of the pages.
 *
 * @datecreated 05.11.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Screen Links
import WelcomePage from '../screens/WelcomePage';
import SignUpPage from '../screens/SignUpPage';
import LoginPage from '../screens/LoginPage';
import SettingsPage from '../screens/SettingsPage';
import AuthenticationPage from '../screens/AuthenticationPage';
import BottomTabsNavigator from './BottomTabsNavigator';
import CourseDetailsPage from '../screens/CourseDetailsPage';

const Stack =
    createStackNavigator();

// Main Stack navigations
const MainNavigator =
    () => (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
                name="Welcome"
                component={
                    WelcomePage
                }
            />
            <Stack.Screen
                name="SignUp"
                component={
                    SignUpPage
                }
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Login"
                component={
                    LoginPage
                }
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Home"
                component={
                    BottomTabsNavigator
                }
                options={{
                    headerShown: false,
                    title: "",
                    
                }}
            />
            <Stack.Screen
                name="Settings"
                component={
                    SettingsPage
                }
                
            />
            <Stack.Screen
                name="Authentication"
                component={
                    AuthenticationPage
                }
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="CourseDetails"
                component={
                    CourseDetailsPage
                }
            />
        </Stack.Navigator>
    );

export default MainNavigator;
