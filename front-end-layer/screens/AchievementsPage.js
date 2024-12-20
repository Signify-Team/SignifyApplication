/**
 * @file AchievementsPage.js
 * @description Includes the achievements of the user including badges, streaks,
 *              level information etc.
 *
 * @datecreated 05.11.2024
 * @lastmodified 18.12.2024
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/AchievementsStyles';

const AchievementsPage = () => {
    const [selectedDay, setSelectedDay] = useState(2); // Example active day

    const dailyRewards = [1, 2, 3, 4];
    const achievements = [
        {   id: 1, 
            title: "Fast Signer", 
            description: "Complete 5 courses in less than 10 minutes.", 
            isCollectable: true 
        },
        {   id: 2, 
            title: "Signifriend", 
            description: "Add 10 friends.", 
            isCollectable: false 
        },
        { 
            id: 3, 
            title: "Daily Devotee", 
            description: "Log in and practice for 7 consecutive days.", 
            isCollectable: true 
        },
        { 
            id: 4, 
            title: "Speed Learner", 
            description: "Finish a course in under 2 minutes.", 
            isCollectable: true 
        },
        { 
            id: 5, 
            title: "Perfect Streak", 
            description: "Score 100% accuracy on 3 lessons in a row.", 
            isCollectable: true 
        },
        { 
            id: 6, 
            title: "Explorer", 
            description: "Complete lessons from 5 different categories.", 
            isCollectable: false 
        },
        { 
            id: 7, 
            title: "Marathon Signer", 
            description: "Spend 60 minutes practicing in one session.", 
            isCollectable: true 
        },
        { 
            id: 8, 
            title: "Social Butterfly", 
            description: "Add 50 friends.", 
            isCollectable: false 
        },
        { 
            id: 9, 
            title: "Achievement Hunter", 
            description: "Collect 10 achievements.", 
            isCollectable: true 
        },
        { 
            id: 10, 
            title: "Challenge Master", 
            description: "Complete 5 timed challenges successfully.", 
            isCollectable: true 
        },
        { 
            id: 11, 
            title: "Signing Superstar", 
            description: "Complete 20 courses.", 
            isCollectable: false 
        },
        { 
            id: 12, 
            title: "Night Owl", 
            description: "Practice sign language between midnight and 4 AM.", 
            isCollectable: true 
        },
        { 
            id: 13, 
            title: "Quick Learner", 
            description: "Complete a beginner lesson with no mistakes.", 
            isCollectable: true 
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Daily Rewards */}
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

                {/* Achievements Section */}
                <Text style={styles.sectionTitle}>Achievements</Text>
                {achievements.map((achievement) => (
                    <View key={achievement.id} style={styles.achievementCard}>
                        <View style={styles.achievementContent}>
                            <View style={styles.achievementText}>
                                <Text style={styles.cardTitle}>{achievement.title}</Text>
                                <Text style={styles.cardDescription}>{achievement.description}</Text>
                            </View>
                            <Image
                                source={require('../assets/icons/course-info/trophyIcon.png')} 
                                style={styles.trophyImage}
                            />          
                        </View>
                        <TouchableOpacity 
                                style={styles.collectButton} 
                                disabled={!achievement.isCollectable} 
                            >
                                <Image
                                    source={require('../assets/icons/course-info/collect.png')}
                                    style={[
                                        styles.collectImage, 
                                        { opacity: achievement.isCollectable ? 1 : 0.5 } 
                                    ]}
                                />
                            </TouchableOpacity>  
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AchievementsPage;


// import React from 'react';
// import {
//     View,
//     Text,
// } from 'react-native';
// import styles from '../styles/styles';

// // Achievements Page Layout
// const AchievementsPage =
//     () => {
//         return (
//             <View
//                 style={
//                     styles.container
//                 }>
//                 <Text
//                     style={
//                         styles.text
//                     }>
//                     Achievements
//                     Page
//                 </Text>
//             </View>
//         );
//     };

// export default AchievementsPage;


