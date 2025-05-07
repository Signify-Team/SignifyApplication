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
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Page Links
import Courses from '../screens/CoursesPage';
import Profile from '../screens/ProfilePage';
import Quests from '../screens/QuestsPage';
import Achievements from '../screens/AchievementsPage';
import Leaderboard from '../screens/LeaderboardPage';

// Icon Links
import AchievementActiveIcon from '../assets/icons/48x48/achievement-active.png'; //done
import AchievementPassiveIcon from '../assets/icons/48x48/achievement-passive.png'; // done
import DashboardActiveIcon from '../assets/icons/48x48/quests-active.png'; // done
import DashboardPassiveIcon from '../assets/icons/48x48/quests-passive.png'; // done
import HomeActiveIcon from '../assets/icons/48x48/home-active.png'; // done
import HomePassiveIcon from '../assets/icons/48x48/home-passive.png'; // done
import UserActiveIcon from '../assets/icons/48x48/profile-active.png'; 
import UserPassiveIcon from '../assets/icons/48x48/profile-passive.png';
import LeaderboardActiveIcon from '../assets/icons/48x48/leaderboard-active.png'; // done
import LeaderboardPassiveIcon from '../assets/icons/48x48/leaderboard-passive.png'; // done

const Tab =
    createBottomTabNavigator();

const tabBarIcon = ({ route }) => ({ focused }) => {
    let iconSource;
    let iconStyle = styles.bottomBarIcon;

    switch (route.name) {
        case 'Courses':
            iconSource = focused ? HomeActiveIcon : HomePassiveIcon;
            iconStyle = [styles.bottomBarIcon, { width: wp('12%'), height: wp('14%') }];
            break;
        case 'Quests':
            iconSource = focused ? DashboardActiveIcon : DashboardPassiveIcon;
            iconStyle = [styles.bottomBarIcon, { width: wp('12%'), height: wp('14%') }];
            break;
        case 'Profile':
            iconSource = focused ? UserActiveIcon : UserPassiveIcon;
            iconStyle = [styles.bottomBarIcon, { width: wp('12%'), height: wp('14%') }];
            break;
        case 'Achievements':
            iconSource = focused ? AchievementActiveIcon : AchievementPassiveIcon;
            iconStyle = [styles.bottomBarIcon, { width: wp('12%'), height: wp('14%') }];
            break;
        case 'Leaderboard':
            iconSource = focused ? LeaderboardActiveIcon : LeaderboardPassiveIcon;
            iconStyle = [styles.bottomBarIcon, { width: wp('12%'), height: wp('14%') }];
            break;
        default:
            break;
    }
    return(
        <Image
            source={iconSource}
            style={iconStyle}
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
                name="Leaderboard"
                component={Leaderboard}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Achievements"
                component={Achievements}
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
        </Tab.Navigator>
    );
};

export default BottomTabsNavigator;
