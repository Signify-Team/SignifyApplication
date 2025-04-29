/**
 * @file ProfileCard.js
 * @description Profile Card on top of the profile page.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import styles from '../styles/ProfileCardStyle';
import { updateUserProfile } from '../utils/services/userService';

const ProfileCard = ({ profilePic, username, handle, memberSince }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(username);

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('userId', handle.replace('@', ''));
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
                <Image source={profilePic} style={styles.avatar} />
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
