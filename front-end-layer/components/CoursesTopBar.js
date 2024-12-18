/**
 * @file CoursesTopBar.js
 * @description Custom top bar for the courses page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../styles/topBarStyles';
import TurkishFlagIcon from '../assets/icons/header/turkish-flag.png';
import StreaksIcon from '../assets/icons/header/streak.png';
import NotificationsIcon from '../assets/icons/header/notifications.png';

const CoursesTopBar = () => {
    return (
        <View style={styles.container}>
            <Image source={TurkishFlagIcon} style={styles.flagIcon} />

            <View style={styles.center}>
                <Image source={StreaksIcon} style={styles.streakIcon} />
                <Text style={styles.streakText}>5</Text>
            </View>

            <View style={styles.notificationContainer}>
                <Image source={NotificationsIcon} style={styles.notifIcon} />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>2</Text>
                </View>
            </View>
        </View>
    );
};

export default CoursesTopBar;
