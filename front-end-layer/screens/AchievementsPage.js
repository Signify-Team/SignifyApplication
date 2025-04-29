/**
 * @file AchievementsPage.js
 * @description Displays the achievements and daily rewards of the user.
 *
 * @datecreated 20.12.2024
 * @lastmodified 30.04.2025
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, Alert, RefreshControl } from 'react-native';
import styles from '../styles/AchievementsStyles';
import CircularButton from '../components/CircularButton';
import AchievementCard from '../components/AchievementCard';
import AchievementPopup from '../components/AchievementPopup';
import { COLORS } from '../utils/constants';
import rewardIcon from '../assets/icons/course-info/rewardIcon.png';
import { fetchAllAchievements, fetchUserAchievements, collectAchievementReward } from '../utils/services/achievementService';

const AchievementsPage = () => {
    const [currentDay, setCurrentDay] = useState(3); // Example: Day 3 is the current day
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [allAchievements, setAllAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [collectedAchievements, setCollectedAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showAchievementPopup, setShowAchievementPopup] = useState(false);
    const [achievementXp, setAchievementXp] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    const dailyRewards = [
        { id: 1, day: 1 },
        { id: 2, day: 2 },
        { id: 3, day: 3 },
        { id: 4, day: 4 },
    ];

    const loadAchievements = async () => {
        try {
            setLoading(true);
            const [allAchievementsData, userAchievementsData] = await Promise.all([
                fetchAllAchievements(),
                fetchUserAchievements()
            ]);
            
            setAllAchievements(allAchievementsData);
            setUserAchievements(userAchievementsData);
            // Set initial total points from user data
            if (userAchievementsData && userAchievementsData.totalPoints !== undefined) {
                setTotalPoints(userAchievementsData.totalPoints);
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            Alert.alert('Error', 'Failed to load achievements. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadAchievements();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadAchievements();
    }, []);

    const handlePress = (day) => {
        if (day === currentDay) {
            setSelectedDay(day);
        }
    };

    const handleCollectAchievement = async (achievementId) => {
        try {
            const result = await collectAchievementReward(achievementId);
            const updatedUserAchievements = userAchievements.map(achievement => {
                if (achievement._id === achievementId) {
                    return { ...achievement, collected: true };
                }
                return achievement;
            });
            setUserAchievements(updatedUserAchievements);
            
            // Find the achievement in allAchievements to get its rewardPoints
            const achievement = allAchievements.find(a => a._id === achievementId);
            if (achievement) {
                setAchievementXp(achievement.rewardPoints);
                // Update total points with the new value from the server
                setTotalPoints(result.totalPoints);
            }
            
            setShowAchievementPopup(true);
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to collect achievement');
        }
    };

    const handlePopupClose = () => {
        setShowAchievementPopup(false);
    };

    const isAchievementCollected = (achievementId) => {
        const userAchievement = userAchievements.find(userAchievement => userAchievement._id === achievementId);
        return userAchievement?.collected || false;
    };

    const isAchievementUnlocked = (achievementId) => {
        return userAchievements.some(achievement => achievement._id === achievementId);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
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
                {loading ? (
                    <Text style={styles.loadingText}>Loading achievements...</Text>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    allAchievements
                        .sort((a, b) => {
                            const aUnlocked = isAchievementUnlocked(a._id);
                            const bUnlocked = isAchievementUnlocked(b._id);
                            const aCollected = isAchievementCollected(a._id);
                            const bCollected = isAchievementCollected(b._id);

                            // First priority: unlocked but not collected
                            if (aUnlocked && !aCollected && !(bUnlocked && !bCollected)) return -1;
                            if (bUnlocked && !bCollected && !(aUnlocked && !aCollected)) return 1;

                            // Second priority: locked achievements
                            if (!aUnlocked && bUnlocked) return -1;
                            if (!bUnlocked && aUnlocked) return 1;

                            // Third priority: collected achievements
                            if (aCollected && !bCollected) return 1;
                            if (bCollected && !aCollected) return -1;

                            return 0;
                        })
                        .map((achievement) => {
                            const isUnlocked = isAchievementUnlocked(achievement._id);
                            return (
                                <AchievementCard
                                    key={achievement._id}
                                    title={achievement.name}
                                    description={achievement.description}
                                    isCollectable={isUnlocked}
                                    isCollected={isAchievementCollected(achievement._id)}
                                    onCollect={() => handleCollectAchievement(achievement._id)}
                                />
                            );
                        })
                )}
            </ScrollView>

            <AchievementPopup
                visible={showAchievementPopup}
                onClose={handlePopupClose}
                xp={achievementXp}
                totalPoints={totalPoints}
            />
        </View>
    );
};

export default AchievementsPage;
