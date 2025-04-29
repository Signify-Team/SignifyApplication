/**
 * @file ProfilePage.js
 * @description Profile page including user information, preferences, changeable information.
 *              Includes a settings button for the user to change their preferences.
 *
 * @datecreated 05.11.2024
 * @lastmodified 19.12.2024
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import styles from '../styles/ProfileCardStyle.js';
import { SIZES, COLORS } from '../utils/constants.js';
import { fetchUserProfile } from '../utils/apiService.js';
import { fetchUserBadges } from '../utils/apiService.js';
import { useNavigation } from '@react-navigation/native';

// Components
import ProfileTopBar from '../components/ProfileTopBar';
import ProfileCard from '../components/ProfileCard';
import StatsCard from '../components/StatsCard.js';
import RectangularButton from '../components/RectangularButton.js';
import InfoBox from '../components/InfoBox.js';
import KoalaHand from '../assets/icons/header/koala-hand.png';
import TurkishFlag from '../assets/icons/header/turkish-flag.png';
import AmericanFlag from '../assets/icons/header/american-flag.png';
import FireIcon from '../assets/icons/header/streak.png';
import AchievementIcon from '../assets/icons/48x48/achievement-active.png';
import BadgeModal from '../components/BadgeModal';

const {height} = Dimensions.get('window');

const ProfilePage = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [badges, setBadges] = useState([]);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const loadUserProfile = async () => {
        try {
            const data = await fetchUserProfile();
            setUserData(data);
            // Fetch badges after getting user data
            if (data.badges && data.badges.length > 0) {
                // Create badge objects with earned dates
                const badgeData = await fetchUserBadges(data.badges.map(badge => badge.badgeId));
                const badgesWithDates = badgeData.map((badge, index) => ({
                    ...badge,
                    dateEarned: data.badges[index].dateEarned
                }));
                setBadges(badgesWithDates);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching user profile:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadUserProfile();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadUserProfile();
    }, []);

    const handleBadgePress = (badge) => {
        setSelectedBadge(badge);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedBadge(null);
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.bright_button_color} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <>
            <ProfileTopBar />
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.bright_button_color]}
                            tintColor={COLORS.bright_button_color}
                        />
                    }
                >
                    <ProfileCard
                        profilePic={KoalaHand}
                        username={userData?.username || 'Loading...'}
                        handle={`@${userData?.username || 'username'}`}
                        memberSince={new Date(userData?.createdAt).getFullYear().toString()}
                    />

                    {/* Info Bar */}
                    <View style={styles.infoRow}>
                        <InfoBox
                            icon={userData?.languagePreference === 'TID' ? TurkishFlag : AmericanFlag}
                            value=""
                            label="Course"
                        />
                        <View style={styles.divider} />
                        <InfoBox
                            value={userData?.followerCount?.toString() || '0'}
                            label="Followers"
                        />
                        <View style={styles.divider} />
                        <InfoBox
                            value={userData?.followingCount?.toString() || '0'}
                            label="Following"
                        />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <RectangularButton
                            width={305}
                            text="ADD FRIENDS"
                            color={COLORS.bright_button_color}
                            onPress={() => navigation.navigate('AddFriends')}
                        />

                        <RectangularButton
                            width={50}
                            icon={require('../assets/icons/header/share.png')}
                            onlyIcon={true}
                            color={COLORS.bright_button_color}
                            onPress={() => console.log('Icon button pressed')}
                        />
                    </View>
                    {/* Statistics */}
                    <Text style={styles.header}>Statistics</Text>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            icon={FireIcon}
                            value={userData?.streakCount || 0}
                        />
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            text="Total Points"
                            value={userData?.totalPoints || 0}
                            showIcon={false}
                            showText={true}
                        />
                    </View>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            text="Progress"
                            value={`${userData?.learningLanguages?.[0]?.progress || 0}%`}
                            showIcon={false}
                            showText={true}
                        />
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            text="Level"
                            value={userData?.learningLanguages?.[0]?.level || 1}
                            showIcon={false}
                            showText={true}
                        />
                    </View>

                    {/* Badges */}
                    <Text style={styles.header}>Badges</Text>
                    <View style={styles.badgesGrid}>
                        {[...Array(4)].map((_, index) => (
                            <View key={index} style={styles.badgeCard}>
                                {badges[index] ? (
                                    <TouchableOpacity 
                                        onPress={() => handleBadgePress(badges[index])}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <StatsCard
                                            height={height * SIZES.badgesContainer}
                                            width={'100%'}
                                            icon={AchievementIcon}
                                            showIcon={true}
                                            showText={false}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={[styles.statsContainer, { height: height * SIZES.badgesContainer, width: '100%' }]} />
                                )}
                            </View>
                        ))}
                    </View>
                    <View style={styles.badgesGrid}>
                        {[...Array(4)].map((_, index) => (
                            <View key={index} style={styles.badgeCard}>
                                {badges[index + 4] ? (
                                    <TouchableOpacity 
                                        onPress={() => handleBadgePress(badges[index + 4])}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <StatsCard
                                            height={height * SIZES.badgesContainer}
                                            width={'100%'}
                                            icon={AchievementIcon}
                                            showIcon={true}
                                            showText={false}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={[styles.statsContainer, { height: height * SIZES.badgesContainer, width: '100%' }]} />
                                )}
                            </View>
                        ))}
                    </View>

                    <BadgeModal
                        visible={modalVisible}
                        onClose={handleCloseModal}
                        badge={selectedBadge}
                    />
                </ScrollView>
            </View>
        </>
    );
};

export default ProfilePage;
