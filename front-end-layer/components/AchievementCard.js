/**
 * @file AchievementCard.js
 * @description Displays an achievement card with title, description, trophy icon, and a collect button.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/AchievementCardStyle';
import RectangularButton from './RectangularButton';

const AchievementCard = ({ title, description, isCollectable }) => {
    return (
        <View style={styles.achievementCard}>
            <View style={styles.achievementContent}>
                <View style={styles.achievementText}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                </View>
                <Image
                    source={require('../assets/icons/course-info/trophyIcon.png')}
                    style={styles.trophyImage}
                />
            </View>
            <View style={styles.buttonContainer}>
                <RectangularButton
                    width={120}
                    text="COLLECT"
                    color={isCollectable ? COLORS.secondary : COLORS.gray}
                    onPress={() => {}}
                    onlyText={true}
                    disabled={!isCollectable}
                />
            </View>
        </View>
    );
};

export default AchievementCard;
