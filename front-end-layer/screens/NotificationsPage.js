/**
 * @file NotificationsPage.js
 * @description Displays user notifications with a modern and cute UI.
 *
 * @datecreated 23.12.2024
 * @lastmodified 02.05.2025
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/NotificationPageStyles';
import StreaksIcon from '../assets/icons/header/streak.png';
import TrophyIcon from '../assets/icons/course-info/trophyIcon.png';
import KoalaIcon from '../assets/icons/header/koala-hand.png';
import FollowerIcon from '../assets/icons/header/followerIcon.png'
import BackIcon from '../assets/icons/header/back.png';
import { fetchUserNotifications, markNotificationAsRead, deleteNotification } from '../utils/services/notificationService';
import { playBackMenuSound } from '../utils/services/soundServices';
import NotificationPopup from '../components/NotificationPopup';

const NotificationsPage = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const fetchedNotifications = await fetchUserNotifications();
            console.log('Fetched notifications:', fetchedNotifications);

            // Sort notifications by date in descending order (newest first)
            const sortedNotifications = fetchedNotifications.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            const formattedNotifications = sortedNotifications.map(notification => ({
                ...notification,
                id: notification._id,
                type: notification.type || 'general',
                title: notification.title || 'Notification',
                message: notification.message,
                timestamp: new Date(notification.date),
                isRead: notification.isRead,
                icon: getNotificationIcon(notification.type)
            }));

            console.log('Formatted notifications:', formattedNotifications);
            setNotifications(formattedNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            Alert.alert('Error', 'Failed to load notifications. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'streak':
                return StreaksIcon;
            case 'badge':
                return TrophyIcon;
            case 'course':
                return KoalaIcon;
            case 'follow':
                return FollowerIcon;
            default:
                return KoalaIcon;
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

    const handleNotificationPress = async (item) => {
        try {
            console.log('Handling notification press:', item);
            setSelectedNotification(item);
        } catch (error) {
            console.error('Error in handleNotificationPress:', error);
        }
    };

    const updateTopBarNotificationCount = async () => {
        // Trigger a refresh of user data in the parent navigation component
        if (navigation.getParent()) {
            navigation.getParent().setParams({ refreshTrigger: Date.now() });
        }
    };

    const handlePopupClose = async () => {
        if (selectedNotification && !selectedNotification.isRead) {
            try {
                await markNotificationAsRead(selectedNotification);
                const updatedNotifications = notifications.map(notification =>
                    notification.id === selectedNotification.id
                        ? { ...notification, isRead: true }
                        : notification
                );
                setNotifications(updatedNotifications);

                // Update notification count in top bar
                await updateTopBarNotificationCount();
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
        setSelectedNotification(null);
    };

    const handleDeleteNotification = async (item) => {
        try {
            await deleteNotification(item);
            const updatedNotifications = notifications.filter(
                notification => notification.id !== item.id
            );
            setNotifications(updatedNotifications);

            // Update notification count in top bar if the deleted notification was unread
            if (!item.isRead) {
                await updateTopBarNotificationCount();
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            Alert.alert('Error', 'Failed to delete notification. Please try again.');
        }
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                !item.isRead && styles.unreadNotification,
            ]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={styles.notificationIconContainer}>
                <Image
                    source={item.icon}
                    style={styles.notificationIcon}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(item)}
            >
                <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
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
                    onPress={() => {
                        playBackMenuSound();
                        navigation.goBack();
                    }}
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
            <NotificationPopup
                visible={selectedNotification !== null}
                onClose={handlePopupClose}
                title={selectedNotification?.title || 'Notification'}
                message={selectedNotification?.message || ''}
                icon={selectedNotification?.icon}
            />
        </View>
    );
};

export default NotificationsPage;
