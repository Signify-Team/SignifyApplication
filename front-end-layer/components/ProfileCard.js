/**
 * @file ProfileCard.js
 * @description Profile Card on top of the profile page.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/ProfileCardStyle';

const ProfileCard = ({ profilePic, username, handle, memberSince }) => {
    return (
        <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
                <Image source={profilePic} style={styles.avatar} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.userTitle}>{username}</Text>
                <Text style={styles.handle}>{handle}</Text>
                <Text style={styles.memberSince}>Member since {memberSince}</Text>
            </View>
        </View>
    );
};

export default ProfileCard;
