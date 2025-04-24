/**
 * @file MainNavigator.js
 * @description Includes main navigations of the pages.
 *
 * @datecreated 05.11.2024
 * @lastmodified 23.12.2024
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { linking } from '../utils/linking';

// Screen Links
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpPage from '../screens/SignUpPage';
import LoginPage from '../screens/LoginPage';
import SettingsPage from '../screens/SettingsPage';
import AuthenticationPage from '../screens/AuthenticationPage';
import BottomTabsNavigator from './BottomTabsNavigator';
import CourseDetailsPage from '../screens/CourseDetailsPage';
import CoursesPage from '../screens/CoursesPage';
import LanguagePreferencePage from '../screens/LanguagePreferencePage';
import NotificationsPage from '../screens/NotificationsPage';
import ForgotPasswordPage from '../screens/ForgotPasswordPage';
import ResetPasswordPage from '../screens/ResetPasswordPage';
import ChangePasswordPage from '../screens/ChangePasswordPage';
import DictionaryPage from '../screens/DictionaryPage';
import WordVideoPage from '../screens/WordVideoPage';

const Stack =
createStackNavigator();

// Main Stack navigations
const MainNavigator = () => (
    <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
            headerShown: false,
        }}
        linking={linking}>
        <Stack.Screen
            name="Splash"
            component={SplashScreen}
        />
        <Stack.Screen
            name="Welcome"
            component={
                WelcomeScreen
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
            component={BottomTabsNavigator}
            options={{
                headerShown: false,
                title: '',
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
            name="LanguagePreference"
            component={LanguagePreferencePage}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Dictionary"
            component={DictionaryPage}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen 
            name="WordVideo" 
            component={WordVideoPage}
        />

        <Stack.Screen
            name="CourseDetails"
            component={
                CourseDetailsPage
            }
        />
        <Stack.Screen
            name="Courses"
            component={CoursesPage}
        />
        <Stack.Screen
            name="Notifications"
            component={NotificationsPage}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordPage}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordPage}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordPage}
            options={{
                headerShown: false,
            }}
        />
    </Stack.Navigator>
);

export default MainNavigator;
