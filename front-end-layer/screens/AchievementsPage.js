/**
 * @file AchievementsPage.js
 * @description Displays the achievements and daily rewards of the user.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import styles from '../styles/AchievementsStyles';
import CircularButton from '../components/CircularButton';
import AchievementCard from '../components/AchievementCard';
import { COLORS } from '../utils/constants';
import rewardIcon from '../assets/icons/course-info/rewardIcon.png';

const AchievementsPage = () => {
    const [currentDay, setCurrentDay] = useState(3); // Example: Day 3 is the current day
    const [selectedDay, setSelectedDay] = useState(currentDay);

    const dailyRewards = [
        { id: 1, day: 1 },
        { id: 2, day: 2 },
        { id: 3, day: 3 },
        { id: 4, day: 4 },
    ];

    const achievements = [
        { id: 1, title: 'Fast Signer', description: 'Complete 5 courses in less than 10 minutes.', isCollectable: true },
        { id: 2, title: 'Signifriend', description: 'Add 10 friends.', isCollectable: false },
        { id: 3, title: 'Daily Devotee', description: 'Log in and practice for 7 consecutive days.', isCollectable: true },
        { id: 4, title: 'Speed Learner', description: 'Finish a course in under 2 minutes.', isCollectable: true },
        { id: 5, title: 'Perfect Streak', description: 'Score 100% accuracy on 3 lessons in a row.', isCollectable: true },
    ];

    const handlePress = (day) => {
        if (day === currentDay) {
            setSelectedDay(day);
        }
    };

    // Print the disabled rewards
    console.log(dailyRewards.filter((reward) => reward.day < currentDay));

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Claim Daily Reward Section */}
                <View style={styles.cardContainer}>
                    <Text style={styles.sectionTitle}>Claim Daily Reward</Text>
                    <View style={styles.rewardBox}>
                        {dailyRewards.map((reward) => (
                            <View key={reward.id} style={styles.rewardContainer}>
                                <Image
                                    source={rewardIcon}
                                    style={[
                                        styles.rewardImage,
                                        reward.day < currentDay && styles.rewardImageDisabled,
                                    ]}
                                />
                                <CircularButton
                                    size={40}
                                    text={`${reward.day}`}
                                    color={
                                        reward.day === selectedDay
                                            ? COLORS.secondary
                                            : COLORS.gray
                                    }
                                    textColor={
                                        reward.day === currentDay ? COLORS.soft_pink_background : COLORS.neutral_base_dark
                                    }
                                    onPress={() => handlePress(reward.day)}
                                    onlyText={true}
                                    disabled={reward.day < currentDay}
                                />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Achievements Section */}
                <Text style={styles.sectionTitle}>Achievements</Text>
                {achievements.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        title={achievement.title}
                        description={achievement.description}
                        isCollectable={achievement.isCollectable}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default AchievementsPage;
