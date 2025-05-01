import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import { styles } from '../styles/AddFriendsPageStyles';
import FireIcon from '../assets/icons/header/streak.png';
import AchievementIcon from '../assets/icons/48x48/achievement-active.png';

const FriendStatsModal = ({ visible, onClose, userStats, isFriend }) => {
    if (!userStats) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Image 
                            source={userStats.profilePicture ? { uri: userStats.profilePicture } : require('../assets/icons/header/koala-hand.png')}
                            style={styles.modalProfilePic}
                        />
                        <Text style={styles.modalUsername}>{userStats.username}</Text>
                        {isFriend && (
                            <Text style={styles.friendLabel}>(Friend)</Text>
                        )}
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Image source={FireIcon} style={styles.statIcon} />
                            <Text style={styles.statValue}>{userStats.streakCount}</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Image source={AchievementIcon} style={styles.statIcon} />
                            <Text style={styles.statValue}>{userStats.totalPoints}</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default FriendStatsModal; 