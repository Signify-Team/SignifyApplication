/**
 * @file AchievementsPage.js
 * @description Displays the achievements and daily rewards of the user.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constants';
import achievementService from '../utils/services/achievementService';
import { getUserId } from '../utils/services/authService';
import AchievementCard from '../components/AchievementCard';

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchAchievements = async () => {
        try {
            setError(null);
            const userId = await getUserId();
            if (!userId) {
                throw new Error('No user ID found. Please log in again.');
            }
            const userAchievements = await achievementService.fetchUserAchievements(userId);
            setAchievements(userAchievements);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const handleCollectReward = async (achievementId) => {
        try {
            const userId = await getUserId();
            if (!userId) {
                throw new Error('No user ID found. Please log in again.');
            }
            await achievementService.collectAchievementReward(userId, achievementId);
            // Refresh achievements after collecting
            fetchAchievements();
        } catch (err) {
            setError(err.message);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchAchievements();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={achievements}
                keyExtractor={(item) => item.achievementId._id}
                renderItem={({ item }) => (
                    <AchievementCard
                        achievement={item.achievementId}
                        unlocked={item.unlocked}
                        collected={item.collected}
                        dateEarned={item.dateEarned}
                        onCollect={() => handleCollectReward(item.achievementId._id)}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default AchievementsPage;
