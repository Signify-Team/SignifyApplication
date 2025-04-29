/**
 * @file AchievementPopup.js
 * @description Custom popup for achievement collection
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import styles from '../styles/AchievementPopupStyles';
import { COLORS } from '../utils/constants';
import rewardIcon from '../assets/icons/course-info/rewardIcon.png';

const AchievementPopup = ({ visible, onClose, xp, totalPoints }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.container}>
                <View style={styles.popup}>
                    <Image 
                        source={rewardIcon} 
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Achievement Unlocked</Text>
                    <Text style={styles.message}>Congratulations! You've earned some XP!</Text>
                    
                    <View style={styles.xpContainer}>
                        <Text style={styles.xpText}>+{xp} XP</Text>
                        <Text style={styles.totalPointsText}>Total: {totalPoints} XP</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default React.memo(AchievementPopup); 