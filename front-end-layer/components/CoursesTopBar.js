/**
 * @file CoursesTopBar.js
 * @description Custom top bar for the courses page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 16.12.2024
 */

import React, { useState, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../styles/topBarStyles';
import TurkishFlagIcon from '../assets/icons/header/turkish-flag.png';
import AmericanFlagIcon from '../assets/icons/header/american-flag.png';
import StreaksIcon from '../assets/icons/header/streak.png';
import NotificationsIcon from '../assets/icons/header/notifications.png';
import { fetchUserProfile } from '../utils/apiService';

const CoursesTopBar = ({ refreshTrigger }) => {
    const [userData, setUserData] = useState({
        streakCount: 0,
        unreadNotifications: 0,
        languagePreference: 'TID'
    }); // the default top bar if the needed information cannot be found

    useEffect(() => {
        loadUserData(); //load the data from the userId stored from login or register
    }, [refreshTrigger]); // Add refreshTrigger as a dependency

    const loadUserData = async () => {
        try {
            const userProfile = await fetchUserProfile();
            setUserData({
                streakCount: userProfile.streakCount || 0,
                unreadNotifications: userProfile.unreadNotifications || 0,
                languagePreference: userProfile.languagePreference || 'TID'
            }); // set to default values in case of empty data
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const getLanguageFlag = (language) => {
        switch (language) {
            case 'ASL':
                return AmericanFlagIcon;
            case 'TID':
                return TurkishFlagIcon;
            default:
                return TurkishFlagIcon; // didn't use else in case there will be additions to languages in the future
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={getLanguageFlag(userData.languagePreference)} 
                style={styles.flagIcon} 
            />

            <View style={styles.center}>
                <View style={styles.streakBox}>
                    <Image source={StreaksIcon} style={styles.streakIcon} />
                    <Text style={styles.streakText}>{userData.streakCount}</Text>
                </View>

                <View style={styles.notificationContainer}>
                    <Image source={NotificationsIcon} style={styles.notifIcon} />
                    {userData.unreadNotifications > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{userData.unreadNotifications}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default CoursesTopBar;
