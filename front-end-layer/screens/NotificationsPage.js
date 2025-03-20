/**
 * @file NotificationsPage.js
 * @description Displays user notifications with a modern and cute UI.
 *
 * @datecreated 23.12.2024
 * @lastmodified 23.12.2024
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/NotificationPageStyles';
import StreaksIcon from '../assets/icons/header/streak.png';
import TrophyIcon from '../assets/icons/course-info/trophyIcon.png';
import KoalaIcon from '../assets/icons/header/koala-hand.png';
import BackIcon from '../assets/icons/header/back.png';

const NotificationsPage = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            // TODO: Replace with actual API call
            const mockNotifications = [
                {
                    id: '1',
                    type: 'achievement',
                    title: 'First Streak!',
                    message: 'You\'ve completed your first 3-day streak!',
                    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                    isRead: false,
                    icon: StreaksIcon
                },
                {
                    id: '2',
                    type: 'badge',
                    title: 'New Badge Earned',
                    message: 'Congratulations! You\'ve earned the "Quick Learner" badge!',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                    isRead: true,
                    icon: TrophyIcon
                },
                {
                    id: '3',
                    type: 'course',
                    title: 'Course Reminder',
                    message: 'Don\'t forget to practice your daily lessons!',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                    isRead: true,
                    icon: KoalaIcon
                }
            ];
            setNotifications(mockNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadNotifications();
    }, []);

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.notificationItem,
                !item.isRead && styles.unreadNotification
            ]}
            onPress={() => {
                // TODO: Handle notification press
                console.log('Notification pressed:', item.id);
            }}
        >
            <View style={styles.notificationIconContainer}>
                <Image 
                    source={item.icon} 
                    style={styles.notificationIcon}
                    resizeMode="contain"
                />
                {!item.isRead && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image 
                        source={BackIcon} 
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.notificationsList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            />
            <TouchableOpacity 
                style={styles.markAllReadButton}
                onPress={() => {
                    // TODO: Implement mark all as read
                    console.log('Mark all as read pressed');
                }}
            >
                <Text style={styles.markAllReadText}>Mark all as read</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NotificationsPage;
