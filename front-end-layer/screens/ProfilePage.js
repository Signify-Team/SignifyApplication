/**
 * @file ProfilePage.js
 * @description Profile page including user information, preferences, changeable information.
 *              Includes a settings button for the user to change their preferences.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import styles from '../styles/styles';
import ProfileTopBar from '../components/ProfileTopBar';

// Profile Page layout
const ProfilePage =
    () => {
        return (
            <>
                {/* Custom Top Bar */}
                <ProfileTopBar />
                {/* Main content */}
                <View style={styles.container}>
                    <Text style={styles.text}>Profile Page</Text>
                </View>
            </>
        );
    };

export default ProfilePage;
