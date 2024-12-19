/**
 * @file ProfileCard.js
 * @description Profile Card on top of the profile page.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/ProfileCardStyle.js';

const ProfileCard = ({ profilePic, username, date }) => {
    return (
        <View style={styles.profileCard}>
            <Text style={styles.userTitle}>{username}</Text>
        </View>
    );
};

export default ProfileCard;
