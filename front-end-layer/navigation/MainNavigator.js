import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens
import WelcomePage from '../screens/WelcomePage.js';
import SignUpPage from '../screens/SignUpPage';
import LoginPage from '../screens/LoginPage';
import PermissionsPage from '../screens/PermissionsPage';
import Dashboard from '../screens/DashboardPage';
import ProfilePage from '../screens/ProfilePage';
import SettingsPage from '../screens/SettingsPage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const BottomTabsNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Lessons" component={Lessons} />
    <Tab.Screen name="Quizzes" component={Quizzes} />
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Profile" component={ProfilePage} />
    <Tab.Screen name="Notifications" component={Notifications} />
  </Tab.Navigator>
);

// Main Stack Navigator
const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Welcome" component={WelcomePage} />
    <Stack.Screen name="SignUp" component={SignUpPage} />
    <Stack.Screen name="Login" component={LoginPage} />
    <Stack.Screen name="Permissions" component={PermissionsPage} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
  </Stack.Navigator>
);

const App = () => (
  <NavigationContainer>
    <MainNavigator />
  </NavigationContainer>
);

export default App;
