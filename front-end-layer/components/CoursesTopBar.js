/**
 * @file CoursesTopBar.js
 * @description Custom top bar for the courses page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 31.03.2025
 */

import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/topBarStyles';
import TurkishFlagIcon from '../assets/icons/header/turkish-flag.png';
import AmericanFlagIcon from '../assets/icons/header/american-flag.png';
import StreaksIcon from '../assets/icons/header/streak.png';
import NotificationsIcon from '../assets/icons/header/notifications.png';
import { fetchUserProfile, updateLanguagePreference } from '../utils/apiService';
import LanguageDropdown from './LanguageDropdown';

const CoursesTopBar = ({ refreshTrigger, navigation, onLanguageChange }) => {
    const [userData, setUserData] = useState({
        streakCount: 0,
        unreadNotifications: 0,
        languagePreference: 'TID'
    }); // the default top bar if the needed information cannot be found
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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
            console.error('Error loading user data:', error.message);
            console.error('Full error:', error);
            if (error.message.includes('No user ID found')) {
                console.log('User needs to log in again');
            }
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

    const handleLanguageSelect = async (language) => {
        try {
            await updateLanguagePreference(language);
            // Update local state first
            setUserData(prev => ({
                ...prev,
                languagePreference: language
            }));
            // Close dropdown
            setShowLanguageDropdown(false);
            // Notify parent component last
            if (onLanguageChange) {
                onLanguageChange(language);
            }
        } catch (error) {
            console.error('Error updating language preference:', error);
        }
    };

    const handleNotificationPress = () => {
        navigation.navigate('Notifications');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowLanguageDropdown(true)}>
                <Image 
                    source={getLanguageFlag(userData.languagePreference)} 
                    style={styles.flagIcon} 
                />
            </TouchableOpacity>

            <View style={styles.center}>
                <View style={styles.streakBox}>
                    <Image source={StreaksIcon} style={styles.streakIcon} />
                    <Text style={styles.streakText}>{userData.streakCount}</Text>
                </View>

                <TouchableOpacity 
                    style={styles.notificationContainer}
                    onPress={handleNotificationPress}
                >
                    <Image source={NotificationsIcon} style={styles.notifIcon} />
                    {userData.unreadNotifications > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{userData.unreadNotifications}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <LanguageDropdown
                visible={showLanguageDropdown}
                onClose={() => setShowLanguageDropdown(false)}
                currentLanguage={userData.languagePreference}
                onLanguageSelect={handleLanguageSelect}
            />
        </View>
    );
};

export default CoursesTopBar;
