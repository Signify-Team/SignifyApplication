/**
 * @file CourseCompletionPopup.js
 * @description A custom popup to display course completion results
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/CourseCompletionPopupStyle';
import { COLORS } from '../utils/constants';
import SuccessIcon from '../assets/icons/course-info/successIcon.png';
import FailIcon from '../assets/icons/course-info/failedCourseIcon.png';

const CourseCompletionPopup = ({
    visible,
    onClose,
    isPracticeMode,
    isPassed,
    successRate,
    userPoints,
    pointsEarned = 50,
}) => {
    // Determine title based on mode and success
    const getTitle = () => {
        if (isPracticeMode) {
            return isPassed ? 'Practice Complete' : 'Practice Complete';
        } else {
            return isPassed ? 'Course Completed!' : 'Course Completed';
        }
    };

    // Determine message based on mode and success
    const getMessage = () => {
        if (isPracticeMode) {
            return isPassed 
                ? `Great job practicing! You've passed the practice session with a ${successRate.toFixed(1)}% success rate.`
                : `Practice session completed with a ${successRate.toFixed(1)}% success rate. Keep practicing to improve your skills.`;
        } else {
            return isPassed
                ? `Congratulations! You completed the course with a ${successRate.toFixed(1)}% success rate.\n\nYou earned ${pointsEarned} points! Your total points are now ${userPoints}.`
                : `You completed the course with a ${successRate.toFixed(1)}% success rate. Please try again to improve your score and unlock the next course.`;
        }
    };

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
                            source={isPassed ? SuccessIcon : FailIcon} 
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.title}>{getTitle()}</Text>
                    <Text style={styles.message}>{getMessage()}</Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isPassed ? COLORS.secondary : COLORS.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CourseCompletionPopup; 