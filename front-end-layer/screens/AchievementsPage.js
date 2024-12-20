import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import styles from '../styles/AchievementsStyles';
import CircularButton from '../components/CircularButton';
import { COLORS } from '../utils/constants';
import rewardIcon from '../assets/icons/course-info/rewardIcon.png';

const AchievementsPage = () => {
    const [currentDay, setCurrentDay] = useState(3); // Example: Day 2 is the current day
    const [selectedDay, setSelectedDay] = useState(currentDay);

    const dailyRewards = [
        { id: 1, day: 1 },
        { id: 2, day: 2 },
        { id: 3, day: 3 },
        { id: 4, day: 4 },
    ];

    const handlePress = (day) => {
        if (day === currentDay) {
            setSelectedDay(day);
        }
    };
    //print the disabled rewards
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
            </ScrollView>
        </View>
    );
};

export default AchievementsPage;
