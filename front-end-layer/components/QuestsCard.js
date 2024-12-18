/**
 * @file QuestsCard.js
 * @description Quests card component for the quests page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/QuestsCardStyle';
import FlameIcon from '../assets/icons/header/streak.png';
import KoalaHandIcon from '../assets/icons/header/koala-hand.png';

const QuestsCard = ({ title, timeRemaining, progress, total, isDailyQuest, onCompletePress }) => {
    const progressPercentage = (progress / total) * 100;
    const progressText = `${progress}/${total}`;
    const isCompleted = progress === total;
    console.log(isCompleted);

    return (
        <TouchableOpacity
            onPress={isCompleted ? onCompletePress : null}
            disabled={!isCompleted}
            style={[styles.cardContainer, isDailyQuest && styles.timeLimitedCard, isCompleted && styles.completedCard]}
        >
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            {timeRemaining && <Text style={styles.timeRemaining}>{timeRemaining}</Text>}
        </View>

        <View style={isDailyQuest ? styles.progressBarContainerDaily :  styles.progressBarContainerFriends}>
            <View style={[isDailyQuest ? styles.progressBarFillDaily : styles.progressBarFillFriends, { width: `${progressPercentage}%` }]} />
            <Text style={styles.progressText}>{progressText}</Text>
        </View>

        {isDailyQuest && (
            <Image source={FlameIcon} style={styles.icon} />
        )}
        {!isDailyQuest && (
            <Image source={KoalaHandIcon} style={styles.koalaIcon} />
        )}
        </TouchableOpacity>
    );
};

export default QuestsCard;
