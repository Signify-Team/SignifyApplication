/**
 * @file CourseDetailsTopBar.js
 * @description Custom top bar for the course details page with a back button.
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/CourseDetailsTopBarStyles';
import BackIcon from '../assets/icons/header/back.png';
import { playBackMenuSound } from '../utils/services/soundServices';

const CourseDetailsTopBar = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                playBackMenuSound();
                navigation.goBack();
                }}>
                <Image
                    source={BackIcon}
                    style={styles.backIcon}
                />
            </TouchableOpacity>
        </View>
    );
};

export default CourseDetailsTopBar;
