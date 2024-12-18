/**
 * @file ProfileTopBar.js
 * @description Custom top bar for the profile page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import { View, Image } from 'react-native';
import styles from '../styles/styles';
import SettingsIcon from '../assets/icons/header/settings.svg';

const ProfileTopBar = () => (
    <View style={[styles.topBarContainer, styles.topBarProfile]}>
        <Image source={SettingsIcon} style={styles.topBarGearIcon} />
    </View>
);

export default ProfileTopBar;
