/**
 * @file ProfilePage.js
 * @description Profile page including user information, preferences, changeable information.
 *              Includes a settings button for the user to change their preferences.
 *
 * @datecreated 05.11.2024
 * @lastmodified 27.04.2025
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Share
} from 'react-native';
import styles from '../styles/ProfileCardStyle.js';
import { SIZES, COLORS } from '../utils/constants.js';
import {
    fetchUserProfile,
    fetchUserBadges,
    fetchAllBadges,
    fetchUserCourses,         
    fetchSectionsByLanguage 
} from '../utils/apiService.js';
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
    const [userCourses, setUserCourses] = useState([]); 
    const [languageSections, setLanguageSections] = useState([]); 
    const [allBadges, setAllBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);

    const loadData = async () => {
        setLoading(true); 
        setError(null);
        try {
            const profileData = await fetchUserProfile();
            setUserData(profileData);

            if (!profileData) {
                throw new Error("User profile data is missing.");
            }

            const [fetchedUserCourses, fetchedSections, fetchedAllBadges] = await Promise.all([
                fetchUserCourses(),
                profileData.languagePreference ? fetchSectionsByLanguage(profileData.languagePreference) : Promise.resolve([]),
                fetchAllBadges()
            ]);

            setUserCourses(fetchedUserCourses || []); 
            setLanguageSections(fetchedSections || []);
            setAllBadges(fetchedAllBadges || []);

            // Fetch user's earned badges
            if (profileData.badges && profileData.badges.length > 0) {
                const badgeData = await fetchUserBadges(profileData.badges.map(badge => badge.badgeId)) || [];
                const badgesWithDates = badgeData.map((badge, index) => ({
                    ...badge,
                    dateEarned: profileData.badges[index]?.dateEarned
                }));
                setUserBadges(badgesWithDates);
            } else {
                setUserBadges([]); 
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
        loadData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    const progressPercentage = useMemo(() => {
        if (!userData || !Array.isArray(userCourses) || !Array.isArray(languageSections)) {
            console.log("Progress calculation skipped: Missing data", {userData, userCourses, languageSections});
            return 0;
        }

        const userLang = userData.languagePreference;
        if (!userLang) {
            console.log("Progress calculation skipped: Missing language preference");
            return 0; 
        }

        const completedCount = userCourses.filter(uc =>
            uc && uc.completed && uc.language === userLang 
        ).length;

        let totalCount = 0;
        languageSections.forEach(section => {
            if (section && section.courses && Array.isArray(section.courses) && section.language === userLang) {
                totalCount += section.courses.length;
            }
        });

        console.log("Progress calculation:", { userLang, completedCount, totalCount });

        if (totalCount === 0) {
            return 0; // Avoid division by zero
        }

        return Math.round((completedCount / totalCount) * 100);
    }, [userData, userCourses, languageSections]);


    const handleBadgePress = (badge) => {
        setSelectedBadge(badge);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedBadge(null);
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out my profile on Signify! Username: ${userData?.username || 'User'}`,
                // add any url we might want to direct in the future here 
            });
        } catch (error) {
            alert(error.message);
        }
    }

    const renderBadgeGrid = (badges, startIndex) => {
        return (
            <View style={styles.badgesGrid}>
                {[...Array(4)].map((_, index) => {
                    const badge = badges[startIndex + index];
                    const hasBadge = userBadges.some(userBadge => userBadge._id === badge?._id);
                    
                    return (
                        <View key={index} style={styles.badgeCard}>
                            {badge ? (
                                <TouchableOpacity 
                                    onPress={() => handleBadgePress(badge)}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <StatsCard
                                        height={height * SIZES.badgesContainer}
                                        width={'100%'}
                                        icon={badge.iconUrl ? { uri: badge.iconUrl } : AchievementIcon}
                                        showIcon={true}
                                        showText={false}
                                        iconStyle={!hasBadge ? { opacity: 0.7 } : {}}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <View style={[styles.statsContainer, { height: height * SIZES.badgesContainer, width: '100%' }]} />
                            )}
                        </View>
                    );
                })}
            </View>
        );
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
                        profilePic={userData?.profilePicture ? { uri: userData.profilePicture } : KoalaHand}
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
                            onPress={onShare}
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
                            showIcon={true}
                            showText={false}
                            iconStyle={{ width: 24, height: 24 }}
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
                            value={`${progressPercentage}%`}
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
                    {renderBadgeGrid(allBadges, 0)}
                    {renderBadgeGrid(allBadges, 4)}

                    <BadgeModal
                        visible={modalVisible}
                        onClose={handleCloseModal}
                        badge={selectedBadge}
                        userBadges={userBadges}
                    />
                </ScrollView>
            </View>
        </>
    );
};

export default ProfilePage;
