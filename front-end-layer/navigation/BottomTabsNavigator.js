/**
 * @file BottomTabsNavigator.js
 * @description Bottom Tab navigations are handled in this file.
 *
 * @datecreated 05.11.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import styles from '../styles/styles';

// Page Links
import Courses from '../screens/CoursesPage';
import Profile from '../screens/ProfilePage';
import Quests from '../screens/QuestsPage';
import Achievements from '../screens/AchievementsPage';

// Icon Links
import AchievementActiveIcon from '../assets/icons/48x48/achievement-active.png';
import AchievementPassiveIcon from '../assets/icons/48x48/achievement-passive.png';
import DashboardActiveIcon from '../assets/icons/48x48/dashboard-active.png';
import DashboardPassiveIcon from '../assets/icons/48x48/dashboard-passive.png';
import HomeActiveIcon from '../assets/icons/48x48/home-active.png';
import HomePassiveIcon from '../assets/icons/48x48/home-passive.png';
import UserActiveIcon from '../assets/icons/48x48/user-active.png';
import UserPassiveIcon from '../assets/icons/48x48/user-passive.png';

const Tab =
    createBottomTabNavigator();

const tabBarIcon = ({ route }) => ({ focused }) => {
    let iconSource;

    switch (route.name) {
        case 'Courses':
            iconSource = focused ? HomeActiveIcon : HomePassiveIcon;
            break;
        case 'Quests':
            iconSource = focused ? DashboardActiveIcon : DashboardPassiveIcon;
            break;
        case 'Profile':
            iconSource = focused ? UserActiveIcon : UserPassiveIcon;
            break;
        case 'Achievements':
            iconSource = focused ? AchievementActiveIcon : AchievementPassiveIcon;
            break;
        default:
            break;
    }
    return(
        <Image
            source={iconSource}
            style={styles.bottomBarIcon}
        />
    );
};
const BottomTabsNavigator = ({ route }) => {
    const initialParams = {
        ...route.params,
        streakMessage: route.params?.streakMessage
    };

    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarIcon: tabBarIcon({ route }),
                tabBarShowLabel: false,
                tabBarStyle: styles.bottomBarContainer,
            })}
            initialRouteName="Courses"
        >
            <Tab.Screen
                name="Courses"
                component={Courses}
                initialParams={initialParams}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Quests"
                component={Quests}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Achievements"
                component={Achievements}
            />
        </Tab.Navigator>
    );
};

export default BottomTabsNavigator;
