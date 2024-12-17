/**
 * @file QuestsCard.js
 * @description Quests card component for the quests page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 16.12.2024
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/QuestsCardStyle';
import FlameIcon from '../assets/icons/header/streak.png';

const QuestsCard = ({ title, timeRemaining, progress, total, isTimeLimited, isCompleted }) => {
  const progressPercentage = (progress / total) * 100;

  return (
    <View style={[styles.cardContainer, isTimeLimited && styles.timeLimitedCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {timeRemaining && <Text style={styles.timeRemaining}>{timeRemaining}</Text>}
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>

      {isTimeLimited && (
        <Image source={FlameIcon} style={styles.icon} />
      )}
      {isCompleted && (
        <Image source={FlameIcon} style={styles.icon} />
      )}
    </View>
  );
};

export default QuestsCard;
