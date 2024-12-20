/**
 * @file AchievementCard.js
 * @description Displays an achievement card with title, description, trophy icon, and a collect button.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/AchievementCardStyle';

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
            <TouchableOpacity
                style={[
                    styles.collectButton,
                    !isCollectable && styles.collectButtonDisabled,
                ]}
                disabled={!isCollectable}
            >
                <Text style={styles.collectButtonText}>COLLECT</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AchievementCard;
