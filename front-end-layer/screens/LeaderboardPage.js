/**
 * @file LeaderboardPage.js
 * @description Leaderboard page showing all users sorted by their points.
 *
 * @datecreated 27.04.2025
 * @lastmodified 27.04.2025
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    TouchableOpacity
} from 'react-native';
import { COLORS } from '../utils/constants.js';
import { getAllUsers } from '../utils/services/userService.js';
import { getUserId } from '../utils/services/authService.js';
import KoalaHand from '../assets/icons/header/koala-hand.png';
import LinearGradient from 'react-native-linear-gradient';
import TrophyIcon from '../assets/icons/48x48/achievement-active.png';
import StarIcon from '../assets/icons/header/streak.png';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const LeaderboardPage = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [allUsers, userId] = await Promise.all([
                getAllUsers(),
                getUserId()
            ]);
            
            // Sort users by points in descending order
            const sortedUsers = allUsers.sort((a, b) => b.totalPoints - a.totalPoints);
            setUsers(sortedUsers);
            setCurrentUserId(userId);
        } catch (err) {
            setError(err.message);
            console.error('Error loading leaderboard:', err);
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

    const getRankIcon = (index) => {
        switch(index) {
            case 0:
                return <Image source={TrophyIcon} style={styles.rankIcon} />;
            case 1:
                return <Image source={StarIcon} style={styles.rankIcon} />;
            case 2:
                return <Image source={StarIcon} style={[styles.rankIcon, { opacity: 0.8 }]} />;
            default:
                return null;
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
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
        <LinearGradient
            colors={['#FFE5E5', '#FFF0E5', '#E5F0FF']}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <View style={styles.titleContainer}>
                    <Image source={TrophyIcon} style={styles.headerIcon} />
                    <Text style={styles.header}>Leaderboard</Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.bright_button_color]}
                        tintColor={COLORS.bright_button_color}
                    />
                }
            >
                {users.map((user, index) => (
                    <View 
                        key={user._id} 
                        style={[
                            styles.userRow,
                            user._id === currentUserId && styles.currentUserRow
                        ]}
                    >
                        <View style={styles.rankContainer}>
                            {getRankIcon(index)}
                            <Text style={[
                                styles.rank,
                                index < 3 && styles.topThreeRank
                            ]}>#{index + 1}</Text>
                        </View>
                        <Image 
                            source={user.profilePicture ? { uri: user.profilePicture } : KoalaHand}
                            style={[
                                styles.profilePicture,
                                index < 3 && styles.topThreeProfile
                            ]}
                        />
                        <Text style={[
                            styles.username,
                            user._id === currentUserId && styles.currentUserText
                        ]} numberOfLines={1}>{user.username}</Text>
                        <Text style={[
                            styles.points,
                            user._id === currentUserId && styles.currentUserText
                        ]}>{user.totalPoints} pts</Text>
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? hp('6%') : hp('3%'),
        paddingBottom: hp('2%'),
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        width: wp('8%'),
        height: wp('8%'),
        marginRight: wp('3%'),
    },
    header: {
        fontSize: wp('6%'),
        fontFamily: 'Poppins-SemiBold',
        color: '#FF6B6B',
        textAlign: 'center',
    },
    scrollContent: {
        padding: wp('4%'),
        paddingBottom: hp('4%'),
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('4%'),
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: wp('4%'),
        marginBottom: hp('1.5%'),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    },
    currentUserRow: {
        backgroundColor: COLORS.bright_button_color,
        transform: [{ scale: 1.02 }],
    },
    rankContainer: {
        width: wp('12%'),
        alignItems: 'center',
    },
    rankIcon: {
        width: wp('6%'),
        height: wp('6%'),
        marginBottom: hp('0.5%'),
    },
    rank: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        color: '#666',
    },
    topThreeRank: {
        color: '#FF6B6B',
        fontSize: wp('4.5%'),
    },
    profilePicture: {
        width: wp('11%'),
        height: wp('11%'),
        borderRadius: wp('5.5%'),
        marginRight: wp('3%'),
        borderWidth: 2,
        borderColor: '#FFF',
    },
    topThreeProfile: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    username: {
        flex: 1,
        fontSize: wp('4%'),
        color: '#444',
        fontWeight: '500',
        marginRight: wp('2%'),
    },
    points: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        color: '#666',
        minWidth: wp('15%'),
        textAlign: 'right',
    },
    currentUserText: {
        color: '#FFF',
    },
});

export default LeaderboardPage; 