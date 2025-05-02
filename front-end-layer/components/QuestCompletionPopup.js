/**
 * @file QuestCompletionPopup.js
 * @description A custom popup to display quest completion
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/QuestCompletionPopupStyle';
import { COLORS } from '../utils/constants';
import SuccessIcon from '../assets/icons/course-info/successIcon.png';

const QuestCompletionPopup = ({
    visible,
    onClose,
    questTitle,
    questDescription,
    rewardPoints
}) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={SuccessIcon} 
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.title}>Quest Completed!</Text>
                    <Text style={styles.questTitle}>{questTitle}</Text>
                    <Text style={styles.description}>{questDescription}</Text>
                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardText}>Reward:</Text>
                        <Text style={styles.pointsText}>{rewardPoints} points</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: COLORS.secondary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default QuestCompletionPopup; 