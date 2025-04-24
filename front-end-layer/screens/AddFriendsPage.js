/**
 * @file AddFriendsPage.js
 * @description Page for discovering and adding new friends
 * 
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { getAllUsers, followUser, unfollowUser, getUserProfile } from '../utils/services/userService';
import { createNotification } from '../utils/services/notificationService';
import { getUserId } from '../utils/services/authService';
import { COLORS } from '../utils/constants';
import BackIcon from '../assets/icons/header/back.png';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/AddFriendsPageStyles';
import CustomAlert from '../components/CustomAlert';

const AddFriendsPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUnfollowAlert, setShowUnfollowAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => 
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const loadUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            const currentUserId = await getUserId();
            // Filter out current user from the list
            const otherUsers = allUsers.filter(user => user._id !== currentUserId);
            
            // Get current user's following list
            const currentUser = allUsers.find(user => user._id === currentUserId);
            const followingIds = currentUser?.following || [];
            
            // Add isFollowing flag to each user
            const usersWithFollowingStatus = otherUsers.map(user => ({
                ...user,
                isFollowing: followingIds.includes(user._id)
            }));
            
            setUsers(usersWithFollowingStatus);
            setFilteredUsers(usersWithFollowingStatus);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userToFollow) => {
        try {
            const currentUserId = await getUserId();
            if (!currentUserId) {
                throw new Error('No user ID found. Please log in again.');
            }

            // Get current user's profile
            const currentUserProfile = await getUserProfile(currentUserId);
            if (!currentUserProfile || !currentUserProfile.username) {
                throw new Error('Could not fetch current user profile');
            }

            // If already following, show unfollow confirmation
            if (userToFollow.isFollowing) {
                setSelectedUser(userToFollow);
                setShowUnfollowAlert(true);
                return;
            }

            // First, follow the user
            const response = await followUser(userToFollow._id);
            
            // Only proceed if follow was successful
            if (response && response.message === 'Successfully followed user') {
                try {
                    // Create notification for the followed user
                    await createNotification(
                        'follow',
                        'New Follower',
                        `${currentUserProfile.username} started following you`,
                        userToFollow._id
                    );
                    
                    // Update local state only after both operations succeed
                    setUsers(users.map(user => 
                        user._id === userToFollow._id 
                            ? { ...user, isFollowing: true } 
                            : user
                    ));
                    
                    setFilteredUsers(filteredUsers.map(user => 
                        user._id === userToFollow._id 
                            ? { ...user, isFollowing: true } 
                            : user
                    ));
                } catch (notificationError) {
                    console.error('Error creating notification:', notificationError);
                    // Even if notification fails, we still show success since follow worked
                    setUsers(users.map(user => 
                        user._id === userToFollow._id 
                            ? { ...user, isFollowing: true } 
                            : user
                    ));
                    
                    setFilteredUsers(filteredUsers.map(user => 
                        user._id === userToFollow._id 
                            ? { ...user, isFollowing: true } 
                            : user
                    ));
                }
            } else {
                throw new Error('Failed to follow user');
            }
        } catch (err) {
            console.error('Error following user:', err);
            setError(err.message);
            loadUsers();
        }
    };

    const handleUnfollow = async () => {
        try {
            const response = await unfollowUser(selectedUser._id);
            if (response && response.message === 'Successfully unfollowed user') {
                // Update local state
                setUsers(users.map(user => 
                    user._id === selectedUser._id 
                        ? { ...user, isFollowing: false } 
                        : user
                ));
                
                setFilteredUsers(filteredUsers.map(user => 
                    user._id === selectedUser._id 
                        ? { ...user, isFollowing: false } 
                        : user
                ));
            }
        } catch (err) {
            console.error('Error unfollowing user:', err);
            setError(err.message);
            loadUsers();
        } finally {
            setShowUnfollowAlert(false);
            setSelectedUser(null);
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <View style={styles.userInfo}>
                <Image 
                    source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/icons/header/koala-hand.png')} 
                    style={styles.profilePic} 
                />
                <Text style={styles.username}>{item.username}</Text>
            </View>
            <TouchableOpacity 
                style={[styles.followButton, item.isFollowing && styles.followingButton]}
                onPress={() => handleFollow(item)}
            >
                <Text style={[styles.followButtonText, item.isFollowing && styles.followingButtonText]}>
                    {item.isFollowing ? 'Following' : 'Follow'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.bright_button_color} />
                <Text style={styles.loadingText}>Loading users...</Text>
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
                <Text style={styles.headerTitle}>Add Friends</Text>
            </View>
            <TextInput
                style={styles.searchBar}
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContainer}
            />
            <CustomAlert
                visible={showUnfollowAlert}
                title="Unfollow User"
                message={`Are you sure you want to unfollow ${selectedUser?.username}?`}
                onCancel={() => {
                    setShowUnfollowAlert(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleUnfollow}
                confirmText="Unfollow"
                cancelText="Cancel"
            />
        </View>
    );
};

export default AddFriendsPage; 