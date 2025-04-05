/**
 * @file CourseInfoCard.js
 * @description Creates course info cards.
 *
 * @datecreated 17.12.2024
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/CourseInfoCardStyle.js';
import { COLORS } from '../utils/constants';

const CourseInfoCard = ({ icon, title, isLocked }) => {
    return (
        <View style={[
            styles.card,
            isLocked ? { backgroundColor: COLORS.gray } : { backgroundColor: COLORS.tertiary }
        ]}>
            <View style={styles.innerShadow}/>
            <Image 
                source={icon} 
                style={styles.icon}
            />
            <Text style={[
                styles.title,
                isLocked ? { color: COLORS.neutral_base_medium } : { color: COLORS.neutral_base_dark }
            ]} numberOfLines={1}>{title}</Text>
        </View>
    );
};

export default CourseInfoCard;
