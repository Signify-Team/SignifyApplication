/**
 * @file AchievementsPage.js
 * @description Includes the achievements of the user including badges, streaks,
 *              level information etc.
 *
 * @datecreated 05.11.2024
 * @lastmodified 18.12.2024
 */
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import ClaimDailyReward from '../components/ClaimDailyReward';
import AchievementCard from '../components/AchievementCard';
import styles from '../styles/AchievementsStyles';

const AchievementsPage = () => {
    const [selectedDay, setSelectedDay] = useState(2); // Example active day

    const achievements = [
        { id: 1, title: "Fast Signer", description: "Complete 5 courses in less than 10 minutes.", isCollectable: true },
        { id: 2, title: "Signifriend", description: "Add 10 friends.", isCollectable: false },
        { id: 3, title: "Daily Devotee", description: "Log in and practice for 7 consecutive days.", isCollectable: true },
        { id: 4, title: "Speed Learner", description: "Finish a course in under 2 minutes.", isCollectable: true },
        { id: 5, title: "Perfect Streak", description: "Score 100% accuracy on 3 lessons in a row.", isCollectable: true },
        { id: 6, title: "Explorer", description: "Complete lessons from 5 different categories.", isCollectable: false },
        { id: 7, title: "Marathon Signer", description: "Spend 60 minutes practicing in one session.", isCollectable: true },
        { id: 8, title: "Social Butterfly", description: "Add 50 friends.", isCollectable: false },
        { id: 9, title: "Achievement Hunter", description: "Collect 10 achievements.", isCollectable: true },
        { id: 10, title: "Challenge Master", description: "Complete 5 timed challenges successfully.", isCollectable: true },
        { id: 11, title: "Signing Superstar", description: "Complete 20 courses.", isCollectable: false },
        { id: 12, title: "Night Owl", description: "Practice sign language between midnight and 4 AM.", isCollectable: true },
        { id: 13, title: "Quick Learner", description: "Complete a beginner lesson with no mistakes.", isCollectable: true },
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                <ClaimDailyReward />
                <Text style={styles.sectionTitle}>Achievements</Text>
                {achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} data={achievement} />
                ))}
            </ScrollView>
        </View>
    );
};

export default AchievementsPage;

