/**
 * @file AchievementCard.js
 * @description Achievement Card 
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import buttonStyles from '../styles/RectangularButtonStyle';
import styles from '../styles/AchievementsStyles';

const AchievementCard = ({ data }) => {
    const { title, description, isCollectable } = data;

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
                style={[buttonStyles.button, !isCollectable && { opacity: 0.5 }]} 
                disabled={!isCollectable} 
            >
                <Text style={buttonStyles.text}>Collect</Text>
            </TouchableOpacity>  
        </View>
    );
};

export default AchievementCard;