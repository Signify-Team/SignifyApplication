/**
 * @file AchievementsPage.js
 * @description Displays the achievements and daily rewards of the user.
 *
 * @datecreated 20.12.2024
 * @lastmodified 30.04.2025
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, Alert, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import styles from '../styles/AchievementsStyles';
import CircularButton from '../components/CircularButton';
import AchievementCard from '../components/AchievementCard';
import AchievementPopup from '../components/AchievementPopup';
import { COLORS } from '../utils/constants';
import rewardIcon from '../assets/icons/course-info/rewardIcon.png';
import { fetchAllAchievements, fetchUserAchievements, collectAchievementReward, collectDailyReward } from '../utils/services/achievementService';

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
    const [dailyRewardCollected, setDailyRewardCollected] = useState(false);
    const [lastRewardDate, setLastRewardDate] = useState(null);
    const [shakeAnimation] = useState(new Animated.Value(0));

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
            // Set daily reward status
            if (userAchievementsData && userAchievementsData.lastRewardDate) {
                setLastRewardDate(new Date(userAchievementsData.lastRewardDate));
                const today = new Date();
                const lastReward = new Date(userAchievementsData.lastRewardDate);
                setDailyRewardCollected(
                    lastReward.getDate() === today.getDate() &&
                    lastReward.getMonth() === today.getMonth() &&
                    lastReward.getFullYear() === today.getFullYear()
                );
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

    useEffect(() => {
        if (!dailyRewardCollected) {
            const startShakeAnimation = () => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(shakeAnimation, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(shakeAnimation, {
                            toValue: -1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(shakeAnimation, {
                            toValue: 0.5,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(shakeAnimation, {
                            toValue: -0.5,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(shakeAnimation, {
                            toValue: 0,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            };

            startShakeAnimation();
        } else {
            // Reset animation when collected
            shakeAnimation.setValue(0);
        }
    }, [dailyRewardCollected]);

    const rotateInterpolate = shakeAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-10deg', '10deg']
    });

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

    const handleDailyReward = async () => {
        if (dailyRewardCollected) {
            Alert.alert('Already Collected', 'You have already collected your daily reward today. Come back tomorrow!');
            return;
        }

        try {
            const result = await collectDailyReward();
            if (result && result.totalPoints !== undefined) {
                setDailyRewardCollected(true);
                setLastRewardDate(new Date());
                setTotalPoints(result.totalPoints);
                setAchievementXp(50);
                setShowAchievementPopup(true);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to collect daily reward');
        }
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
                {/* Daily Reward Section */}
                <View style={styles.cardContainer}>
                    <Text style={styles.sectionTitle}>Daily Reward</Text>
                    <View style={styles.rewardBox}>
                        <View style={styles.rewardContainer}>
                            <View style={styles.rewardLeft}>
                                <View style={styles.rewardInfo}>
                                    <Text style={styles.rewardTitle}>Daily Gift</Text>
                                    <Text style={styles.rewardSubtitle}>
                                        {dailyRewardCollected 
                                            ? "Come back tomorrow for another gift! 🎁" 
                                            : "Tap the gift box to collect your daily reward! ✨"}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.rewardRight}>
                                <TouchableOpacity
                                    style={[
                                        styles.rewardImageContainer,
                                        {
                                            transform: [
                                                { rotate: dailyRewardCollected ? '0deg' : rotateInterpolate },
                                                { scale: dailyRewardCollected ? 1 : 1.1 }
                                            ]
                                        }
                                    ]}
                                    onPress={handleDailyReward}
                                    disabled={dailyRewardCollected}
                                >
                                    <Image
                                        source={rewardIcon}
                                        style={styles.rewardImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
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
