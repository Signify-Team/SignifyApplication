/**
 * @file AchievementCard.js
 * @description Displays an achievement card with title, description, trophy icon, and a collect button.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/AchievementCardStyle';
import RectangularButton from './RectangularButton';

const AchievementCard = ({ title, description, isCollectable, isCollected, onCollect }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCollect = async () => {
        if (!isCollectable || isLoading || isCollected) return;
        
        setIsLoading(true);
        try {
            await onCollect();
        } catch (error) {
            console.error('Error collecting achievement:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                {isLoading ? (
                    <ActivityIndicator color={COLORS.secondary} />
                ) : (
                    <RectangularButton
                        width={isCollected ? 150 : 120}
                        text={isCollected ? "COLLECTED" : "COLLECT"}
                        color={isCollected ? COLORS.gray : (isCollectable ? COLORS.secondary : COLORS.gray)}
                        onPress={handleCollect}
                        onlyText={true}
                        disabled={!isCollectable || isCollected}
                    />
                )}
            </View>
        </View>
    );
};

export default AchievementCard;
