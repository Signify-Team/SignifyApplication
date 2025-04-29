/**
 * @file ProfileCard.js
 * @description Profile Card on top of the profile page.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from '../styles/ProfileCardStyle';
import { updateUserProfile } from '../utils/services/userService';
import { getUserId } from '../utils/services/authService';

const ProfileCard = ({ profilePic, username, handle, memberSince, onProfilePicUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(username);
    const [newProfilePic, setNewProfilePic] = useState(null);

    useEffect(() => {
        setNewProfilePic(null);
    }, [profilePic]);

    const handleProfilePicChange = async () => {
        try {
            const options = {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 500,
                maxHeight: 500,
                includeBase64: false,
                selectionLimit: 1,
                saveToPhotos: false,
                presentationStyle: 'fullScreen'
            };

            const response = await launchImageLibrary(options);

            if (response.didCancel) {
                console.log('User cancelled image picker');
                return;
            }

            if (response.errorCode) {
                console.error('ImagePicker Error: ', response.errorMessage);
                return;
            }

            if (!response.assets || response.assets.length === 0) {
                console.log('No assets selected');
                return;
            }

            const userId = await getUserId();
            if (!userId) {
                throw new Error('No user ID found. Please log in again.');
            }

            const formData = new FormData();
            formData.append('userId', userId);
            
            const imageFile = {
                uri: response.assets[0].uri,
                type: 'image/jpeg',
                name: 'profile.jpg'
            };
            
            formData.append('profilePicture', imageFile);

            const updatedUser = await updateUserProfile(formData);
            setNewProfilePic(updatedUser.profilePicture);
            if (onProfilePicUpdate) {
                onProfilePicUpdate(updatedUser.profilePicture);
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    const handleSave = async () => {
        try {
            const userId = await getUserId();
            if (!userId) {
                throw new Error('No user ID found. Please log in again.');
            }
            
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('username', newUsername);
            await updateUserProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating username:', error);
        }
    };

    return (
        <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
                {isEditing ? (
                    <TouchableOpacity 
                        style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}
                        onPress={handleProfilePicChange}
                    >
                        <Text style={styles.addPhotoButtonText}>+</Text>
                    </TouchableOpacity>
                ) : (
                    <Image 
                        source={newProfilePic ? { uri: newProfilePic } : (profilePic?.uri ? profilePic : profilePic)} 
                        style={styles.avatar} 
                        onError={(e) => {
                            setNewProfilePic(null);
                        }}
                    />
                )}
            </View>
            <View style={styles.infoContainer}>
                {isEditing ? (
                    <TextInput
                        style={styles.userTitle}
                        value={newUsername}
                        onChangeText={setNewUsername}
                        autoFocus
                    />
                ) : (
                    <Text style={styles.userTitle}>{username}</Text>
                )}
                <Text style={styles.handle}>{handle}</Text>
                <Text style={styles.memberSince}>Member since {memberSince}</Text>
            </View>
            <TouchableOpacity 
                style={[styles.editButton, { position: 'absolute', top: 10, right: 10 }]}
                onPress={() => {
                    if (isEditing) {
                        handleSave();
                    } else {
                        setIsEditing(true);
                    }
                }}
            >
                <Text style={styles.editButtonText}>
                    {isEditing ? 'Save' : 'Edit'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileCard;
