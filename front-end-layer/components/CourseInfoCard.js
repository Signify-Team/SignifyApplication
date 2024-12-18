/**
 * @file BottomTabsNavigator.js
 * @description Bottom Tab navigations are handled in this file.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/CourseInfoCardStyle.js';

const CourseInfoCard = ({ icon, title }) => {
    return (
        <View style={styles.card}>
            <View style={styles.innerShadow}/>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

export default CourseInfoCard;
