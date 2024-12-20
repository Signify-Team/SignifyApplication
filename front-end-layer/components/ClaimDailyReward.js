/**
 * @file ClaimDailyReward.js
 * @description Daily reward collection of the user.
 *
 * @datecreated 18.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import styles from '../styles/AchievementsStyles';

const ClaimDailyReward = () => {
    const dailyRewards = [1, 2, 3, 4];
    const [selectedDay, setSelectedDay] = React.useState(2);

    return (
        <View>
            <Text style={styles.sectionTitle}>Claim Daily Reward</Text>
            <View style={styles.rewardBox}>
                {dailyRewards.map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.rewardItem,
                            day === selectedDay && styles.activeReward,
                        ]}
                        onPress={() => setSelectedDay(day)}
                    >
                        <Image
                            source={require('../assets/icons/course-info/rewardIcon.png')} 
                            style={styles.rewardImage}
                        />
                        <Text style={[styles.dayNumber, day === selectedDay && styles.activeDay]}>
                            {day}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default ClaimDailyReward;