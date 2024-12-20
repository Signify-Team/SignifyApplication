/**
 * @file ProfileTopBar.js
 * @description Custom top bar for the profile page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/topBarStyles';
import SettingsIcon from '../assets/icons/header/settings.png';

const ProfileTopBar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image source={SettingsIcon} style={styles.settingsIcon} />
            </TouchableOpacity>
        </View>
    );
};

export default ProfileTopBar;
