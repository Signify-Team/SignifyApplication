/**
 * @file BottomTabsNavigator.js
 * @description Bottom Tab navigations are handled in this file.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Page Links
import Courses from '../screens/CoursesPage';
import Dashboard from '../screens/DashboardPage';
import Profile from '../screens/ProfilePage';
import Notifications from '../screens/NotificationsPage';
import Achievements from '../screens/AchievementsPage';

const Tab = createBottomTabNavigator();

// Bottom Tabs navigation
const BottomTabsNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Courses" component={Courses} />
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Profile" component={Profile} />
    <Tab.Screen name="Notifications" component={Notifications} />
    <Tab.Screen name="Achievements" component={Achievements} />
  </Tab.Navigator>
);

export default BottomTabsNavigator;
